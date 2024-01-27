# Use the nginx alpine base image
FROM nginx:alpine

# Remove the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy a new configuration file setting nginx to listen on the standard port 80
COPY nginx.conf /etc/nginx/conf.d

# Copy the static content (HTML, CSS, JavaScript) to the nginx serving directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80


# Start nginx
CMD ["nginx", "-g", "daemon off;"]
