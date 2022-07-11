## Run postgres docker image
```
docker run -d \
	--name mang-postgres \
    -p 5432:5432 \
	-e POSTGRES_PASSWORD=admin \
	-e PGDATA=/var/lib/postgresql/data/pgdata \
	-v ~/docker/postgres:/var/lib/postgresql/data \
	postgres
```
```
docker run -d --name mang-postgres  -p 5432:5432 -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/pgdata -v ~/docker/postgres:/var/lib/postgresql/data postgres
```