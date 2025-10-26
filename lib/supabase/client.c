#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>

int create_socket_and_connect(const char *hostname) {
    int sockfd;
    struct sockaddr_in server_addr;
    struct hostent *server;
    
    // Create socket
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("Error opening socket");
        exit(1);
    }
    
    // Get server by hostname or IP address
    server = gethostbyname(hostname);
    if (server == NULL) {
        fprintf(stderr, "Error: No such host\n");
        close(sockfd);
        exit(1);
    }
    
    // Set up server address structure
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    memcpy(&server_addr.sin_addr.s_addr, server->h_addr, server->h_length);
    server_addr.sin_port = htons(80); // HTTP default port
    
    // Connect to server
    if (connect(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Error connecting to server");
        close(sockfd);
        exit(1);
    }
    
    return sockfd;
}

void send_http_get_request(int sockfd, const char *hostname, const char *path) {
    char request[2048];
    
    // Construct HTTP GET request
    snprintf(request, sizeof(request),
             "GET %s HTTP/1.1\r\n"
             "Host: %s\r\n"
             "Connection: close\r\n"
             "User-Agent: SimpleHTTPClient/1.0\r\n"
             "\r\n",
             path, hostname);
    
    // Send request
    if (send(sockfd, request, strlen(request), 0) < 0) {
        perror("Error sending request");
        close(sockfd);
        exit(1);
    }
    
    printf("HTTP GET request sent to %s\n", hostname);
}

void receive_http_response(int sockfd) {
    char buffer[4096];
    ssize_t bytes_received;
    
    // Receive and print response
    while ((bytes_received = recv(sockfd, buffer, sizeof(buffer) - 1, 0)) > 0) {
        buffer[bytes_received] = '\0';
        printf("%s", buffer);
    }
    
    if (bytes_received < 0) {
        perror("Error receiving response");
    }
}

void interact_with_server(const char *hostname, const char *path) {
    printf("Interacting with server %s...\n", hostname);
    
    // Call function to create a socket and connect to the server
    int sockfd = create_socket_and_connect(hostname);
    
    // Call function to send an HTTP GET request
    send_http_get_request(sockfd, hostname, path);
    
    // Call function to receive and print the HTTP response
    receive_http_response(sockfd);
    
    // Call function to close the socket
    close(sockfd);
}

int main(int argc, char *argv[]) {
    char *hostname;
    char *path = "/"; // Default path
    
    // Check command line arguments
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <hostname> [path]\n", argv[0]);
        fprintf(stderr, "Example: %s www.example.com /index.html\n", argv[0]);
        exit(1);
    }
    
    hostname = argv[1];
    
    // If path is provided as second argument
    if (argc >= 3) {
        path = argv[2];
    }
    
    // Call function to interact with the server
    interact_with_server(hostname, path);
    
    return 0;
}