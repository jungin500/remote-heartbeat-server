# remote-heartbeat-server
- Remote network heartbeat check server using ICMP ping
- Serves heartbeat server with ability to ping current IPv4 network subnet range
- API is simple; just use http://host:port/heartbeat/your.ip.address.here; it would return result HTTP code to determine network status.