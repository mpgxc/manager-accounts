### Criar par de chaves privada e pública

```sh
openssl genrsa -out private-key.pem 2048
```

```sh
openssl rsa -in private-key.pem -pubout -out public-key.pem
```

<p align="center">
 <img src="./prisma/ERD.svg" />
</p>
