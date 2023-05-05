# Web Application - Notes

This web application is a simple notes management system that allows users to create, edit, and delete notes. The application uses Node.js for the server-side, MySQL for the database, and Docker for containerization.

## Prerequisites

To run this web application, you need to have the following tools installed on your system:

- Docker
- Docker Compose
- Git (optional)

## Getting Started

Follow the steps below to get the web application running on your machine:

### 1. Clone the repository (optional)

If you have Git installed, you can clone the repository using the following command:

```sh
git clone https://github.com/yourusername/your-repository.git
```

Replace `yourusername` and `your-repository` with the appropriate values.

### 2. Configure environment variables

Create a `.env` file in the project root directory with the following content:

```
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_PASSWORD=your_password
```

Replace `your_root_password` and `your_password` with your desired MySQL root password and user password, respectively.

### 3. Build and run the web application using Docker Compose

Navigate to the project root directory in the terminal and run the following command:

```sh
docker-compose up
```

This command will build the Docker images for the `app` and `mysql_server` services, create containers, and start the web application.

Once the web application is running, you can access it in your web browser at `http://localhost:8080`.

### 4. Stopping the web application

To stop the web application, press `Ctrl+C` in the terminal where you ran `docker-compose up`. To remove the containers and networks created by Docker Compose, run the following command:

```sh
docker-compose down -v
```

This command will also remove the volumes created by Docker Compose, ensuring a clean environment for the next time you run the web application.

## Using the Web Application

The web application allows you to perform the following actions:

- Create a new note by clicking the "New Note" button and entering the note's title and content.
- Edit an existing note by clicking the "Edit" button next to the note's title.
- Delete a note by clicking the "Delete" button next to the note's title.

Happy note-taking!
