## Installation

Start the Docker Container

Make sure Docker is running on your macOS. Then, open a terminal in the `project-root/` directory and run the following command to build and start the containers:

```
docker-compose up --build
```

This command will build and start both the frontend and backend services. The React app will be available at `http://localhost:3000`, and the backend will be available at `http://localhost:5000`.

### Debugging
You can modify the `volumes` configuration in the `docker-compose.yml` file to ensure that when you make changes to files locally, they will also be updated inside the Docker containers.

Regarding the problem of using docker-compose up --build to display sh: 1: react-scripts: not found:

From the result of running `npm list react-scripts`, it appears that `react-scripts` is not installed, as the output shows `(empty)`. This means that the `react-scripts` dependency was not successfully installed.

To resolve this issue, try the following steps:

1. **Manually Install `react-scripts`**:
    In your `frontend` directory, run the following command to manually install `react-scripts`:

    ```bash
    npm install react-scripts --save
    ```
    
    After the installation is complete, check again to confirm if it was installed successfully:
    ```bash
    npm list react-scripts
    ```
    
    If `react-scripts` is installed successfully, you should see output similar to this:
    ```
    frontend@0.1.0 /path/to/your/project
    └── react-scripts@5.0.1
    ```
    
2. **Re-run Docker**:
    After installing `react-scripts`, rebuild and run the Docker containers:

    ```bash
    docker-compose down
    docker-compose up --build
    ```
## Creating a new branch
Here’s how to push your `theta_project` code to a new branch (`1019-Welcome-Page`) on GitHub using either VSCode or the terminal on macOS:

### Pushing to a New Branch Using the Terminal:

1. **Open the Terminal**:
   You can open the terminal via Spotlight search by typing "Terminal."

2. **Navigate to Your Project Directory**:
   If you're not already in your project directory, use the `cd` command to navigate to your `theta_project` directory. For example:
   ```bash
   cd path/to/your/theta_project
   ```

3. **Create a New Branch**:
   Use `git checkout` to create and switch to a new branch named `1019-Welcome-Page`:
   ```bash
   git checkout -b 1019-Welcome-Page
   ```

4. **Stage Your Changes**:
   Add all your changes to the staging area:
   ```bash
   git add .
   ```

5. **Commit Your Changes**:
   Commit the staged changes with a commit message:
   ```bash
   git commit -m "Update welcome page"
   ```

6. **Push to the Remote New Branch**:
   Push the new branch to GitHub:
   ```bash
   git push origin 1019-Welcome-Page
   ```

### Pushing to a New Branch Using VSCode Git Tools:

1. **Open VSCode and Navigate to Your Project Directory**:
   Open VSCode, use the file explorer on the left to navigate to your `theta_project` folder.

2. **Use the Git Plugin**:
   Click the Source Control icon on the left-hand side. If Git isn't initialized, click `Initialize Repository`.

3. **Create a New Branch**:
   Click the branch icon at the bottom of the VSCode window, select `Create New Branch`, and name it `1019-Welcome-Page`.

4. **Stage and Commit Changes**:
   In the Source Control panel, click the `+` icon to stage your changes. 
   Then, click the checkmark to commit the changes, and write a commit message, such as `"Update welcome page"`.

5. **Push to GitHub**:
   After creating the branch, click `Publish Branch` at the bottom of the VSCode window, and VSCode will automatically push your new branch to GitHub.

## Install packages within a Docker environment:
To install packages using `npm install` within a Docker environment, you typically include the necessary commands in your `Dockerfile` or execute them within the running Docker container. Here's a step-by-step guide to explain how you can install npm packages like `react-router-dom` in a Docker environment.

### Steps to Install `npm install` in Docker Environment:

#### 1. **Dockerfile Approach**
The most common way to install npm packages in a Docker environment is to include the `npm install` command in your `Dockerfile`. Here's a sample `Dockerfile` for a Node.js/React application:
  
  ```Dockerfile
  # Use an official Node.js image
  FROM node:18
  
  # Set the working directory inside the container
  WORKDIR /app
  
  # Copy package.json and package-lock.json to the working directory
  COPY package*.json ./
  
  # Install dependencies
  RUN npm install
  
  # Copy the rest of the application code to the container
  COPY . .
  
  # Expose the port that the app runs on
  EXPOSE 3000
  
  # Start the application
  CMD ["npm", "start"]
  ```

### Explanation:
1. **FROM node:16**: This pulls the official Node.js image with version 16.
2. **WORKDIR /app**: This sets `/app` as the working directory inside the container.
3. **COPY package.json ./**: Copies the `package.json` and `package-lock.json` files to the working directory in the container.
4. **RUN npm install**: This installs all the npm dependencies as listed in `package.json`.
5. **COPY . .**: Copies the remaining project files to the container.
6. **EXPOSE 3000**: Exposes port 3000 to allow external access (this is typically where React apps run).
7. **CMD ["npm", "start"]**: Runs `npm start` to start the application.

#### 2. **Building and Running the Docker Container**
Once you have your `Dockerfile` configured with `npm install`, you can build and run your container:

  ```bash
  # Build the Docker image
  docker build -t your-app-name .
  
  # Run the Docker container
  docker run -p 3000:3000 your-app-name
  ```

This will build the Docker image, install all dependencies during the build process, and start the application.

#### 3. **Installing Packages Inside a Running Container**
If you need to install a package inside a running Docker container, you can follow these steps:

1. **Access the Running Container**: Use `docker exec` to open a shell inside the container.
   
   ```bash
   docker exec -it <container_name> /bin/bash
   ```

2. **Install npm Packages**: Once inside the container, you can run `npm install` just like you would on your local machine.

   ```bash
   npm install <package_name>
   ```

3. **Persisting Changes**: After installing the package, make sure you update the `package.json` and `package-lock.json` files. You can copy the updated files back to your local environment if needed using `docker cp`.

4. **Exit the Container**: Once the installation is complete, exit the container shell:

   ```bash
   exit
   ```

#### 4. **Using Docker-Compose**
If you're using `docker-compose`, you can define the `npm install` step in the `docker-compose.yml` file by including the Dockerfile in the service definition:

```yaml
version: '3'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    command: npm start
```

This setup will automatically run `npm install` during the build process, as specified in the `Dockerfile`.

### Additional Notes
- **Cache Optimization**: To optimize the Docker build process, copy the `package.json` and `package-lock.json` files before copying the rest of the application. This allows Docker to cache the `npm install` step, avoiding repeated installs when the source code changes.
- **Managing Node.js Versions**: You can change the Node.js version in your `Dockerfile` (e.g., `node:18`) if your application requires a specific version of Node.js.
- **Volumes**: Using volumes in `docker-compose` or with the `docker run` command ensures that your changes to files outside the container are automatically reflected inside the container.

By following these steps, you can effectively manage your npm dependencies in a Docker environment, either by installing them during the build process or interactively in a running container.

### Swagger Open API Template
https://editor.swagger.io/

### Playwright Web Scraping
https://hasdata.com/blog/playwright-web-scraping
