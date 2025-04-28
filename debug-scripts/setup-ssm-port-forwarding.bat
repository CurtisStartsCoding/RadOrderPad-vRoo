@echo off
echo Setting up SSM Port Forwarding to MemoryDB...
echo.
echo This will create a tunnel from localhost:6379 to the MemoryDB cluster.
echo Keep this terminal window open while you're working with Redis.
echo.
echo Press Ctrl+C to stop the port forwarding when you're done.
echo.

aws ssm start-session ^
  --target i-09645b54b86c90ccf ^
  --document-name AWS-StartPortForwardingSessionToRemoteHost ^
  --parameters "host=clustercfg.radorderpad-memorydb.i0vhe3.memorydb.us-east-2.amazonaws.com,portNumber=6379,localPortNumber=6379" ^
  --region us-east-2

pause