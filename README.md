I just wrapped up my submission to your technical challenge. Please see the repo at https://github.com/otherwhitefrank/opendns-tech-challenge/

Architecturally, I decided to split up the project into a producer/consumer pair. They communicate via a vanilla RabbitMQ instance. This will allow us to scale them independently depending on which side of the pipeline needs more resources. The data transformation on the Check Point event was relatively simple, but it is easy to imagine it being more complex. In that event we would be able to throw more computing resources at the producer component. The same obviously applies to the consumer portion as well. The only downside is that RabbitMQ becomes necessary infrastructure for the two to function, and therefore a weak link if it goes down. However, RabbitMQ does allow for clustering, so we could make it have some redundancy if this became a concern.

  I considered a few different messaging queue technologies and landed on RabbitMQ. The main reason was because RabbitMQ allows for strong acknowledgements between messages as well as non-acknowledgements. This makes it easy to trigger a resend of any message in the queue. So if one of our consumers has a problem forwarding the message to the S-Platform API we can simple send a nack (non-acknowledgement). Conversely, we have strong acknowledgment that a message has been successfully forwarded (on receipt of a http 202 from s-platform), and can be very certain RabbitMQ will only delete a message after it receives an ack. 
  I also considered Kafka, but moved away because Kafka's focus is more on a consistent logging of events as they come in. You can set a Time to life on messages, but there is no strong acknowledgement between consumers. Instead it takes the philosophy that each consumer is responsible for keeping track of its current location. The nice thing is that messages are easily replayable in Kafka, which would have been nice in the event of errors, since you can rewind and replay them after a code change. 

  Speaking of logging, I ended up just aggregating logging using the winston package. Currently, the project is recording everything even info's. However, in production that log level would certainly be turned down and log rotation would be put in place. The nice thing about the winston library is it records in json so it's machine readable. For more human-readable logging I like the 'jq' command line utility. I just pipe the log through it and it makes the json nice and readable.

Before going to far into the project I spent some time faking CP events. The code is located at /opendns/cp_intake/src/fake_cp.js . The main code uses the 'faker' module to simulate IPs/Usernames/etc. I also wrote a few custom functions to generate session names and other non-standard parts of the CP event. 

I then wrote a simple forward that generates a fake_cp() and posts it to a given IP's port 3000 (where the producer listens). This is under /opendns/cp_intake/sim_event.js

The producer is called cp_intake and it uses expressjs to listen to the /checkpoint endpoint on port 3000. It basicly receives a payload, pipes it into the CP_Intake Transform stream which converts the CP event into more machine-friendly json. Once in json that is piped into ODNS_Mapper Transform stream which maps the submitted json to the appropriate fields for the OpenDNS S-Platform. There is a check before publishing the message which makes sure the required fields of the S-Platform API are present, this is done with the tcomb library. Once the final json is composed it is sent to the RabbitMQ queue for the consumer. The most dangerous part of the pipeline is the Producer->RabbitMQ posting. I turned on confirmation for the RabbitMQ queue, meaning the producer must receive an ack before moving on. If there is an error the producer will retry five times before giving up. It is possible to lose a message if we go past 5 retries, this is a bummer of the current implementation and would be enhanced for production. The CP_Intake object and the ODNS_Mapper are defined in the /opendns/cp_intake/util.js file. 

The consumer is called odns_upload, it listens to the RabbitMQ, and attempts to forward the received payload to S-Platform API. If the API is slower then 1000ms with a response it marks the message with a nack and the message stays in the queue to be redistributed to another consumer. The consumer is much simpler because of the transactional nature of consuming RabbitMQ queues. 

I used mocha/chai for unit tests. Most of the code is off the shelf, the parts I unit-tested were the Transform streams and the tcomb validation object. I thought about unit-testing the fake.js file, but since it includes a lot of randomless I felt there wasn't much to be gained. 

As far as integration tests some simple ones would look like this.
1. Take a known CP event with a known hostname
2. Insert it into the CP_Intake project
3. Wait a short while
4. Using the S-Platform API check to see if the known hostname is now present in the domain list
5. To cleanup remove the known hostname again

Other integration tests would follow a similar pattern, I usually like to remove pieces of the stack and then try to submit, perhaps later adding the piece back in to see if the stack recovers. The difficulty is timing and ensuring state, so often these tests aren't perfect. 

Build steps 
1. There is a build.sh script in the root of the project. It should successfully build the docker containers.
2. There is a run.sh script that launches the stack using docker-compose, it should wire everything together.
3. Use opendns/cp_intake/lib/sim_event.js to attempt to send an event to the consumer (you may need to change the url to your docker installations localhost ip). 

Note: I'm using the Docker Beta for OS X, it doesn't use virtualbox but runs docker closer to the metal like the linux client. This all seems to work on my system, but if you run into problems let me know and i'll try to debug it on an older docker client.
