# Integrated environment for running the graph experiment

These are the instructions for building a Docker project that contains everything to run the experiment, removing the need to install the DBMS and compiler manually.

## Prerequisites

You'll need Docker Desktop installed.

* [Windows](https://docs.docker.com/desktop/install/windows-install/)
  * On Windows, the commands below need to be executed in Powershell.
* [OS X](https://docs.docker.com/desktop/install/mac-install/)
* [Linux](https://docs.docker.com/desktop/install/linux-install/)

## Configuration

To build a meaningful setup, we start from the [tutorial](https://docs.docker.com/compose/gettingstarted/)
that Docker put together to illustrate Compose. In our scenario, we create a graph database (`ArangoDB` at this moment) and then we execute a D application to populate the database.

Please read the comments in [docker-compose.yml](./docker-compose.yml) and check the configurations.

## Execution

### Startup

Make sure the Docker Engine is running. This can be done by opening the Docker Desktop (see above).

In the `docker` subdirectory of the repo root, execute:

```bash
docker compose up -d
```

This may take considerable time initially, but subsequent startups happen a lot quicker.

### Database web interface

The web interface of the database can be accessed using an ordinary web browser, at [http://localhost:8529](http://localhost:8529), using these credentials:

```text
user: root@seus
pass: rootseus
```

⚠ *This is not expected to be used in production*, and the credentials can be changed in [docker-compose.yaml](./docker-compose.yml#L9)

### Foxx

Foxx services need to be installed manually for now. See [../foxx/README.md](../foxx/README.md).

### Running the code

The following command opens an interactive shell in the container:

```shell
docker compose exec d_env bash
```

You will access the `d` container environment, where you can compile the code.

The current repo is mounted in the container, i.e., you can change the code in the `host` machine and compile it in the `container` machine in runtime.

At the shell prompt, the following will compile and run the code.

```shell
dub run -- --pw=rootseus --ip=arangodb
```

### Shutdown

```shell
docker compose down
```
