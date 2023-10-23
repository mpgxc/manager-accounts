import { LoggerService } from '@infra/providers/logger/logger.service';
import 'dotenv/config';
import { z } from 'zod';

const jwtSchema = z.object({
  JWT_REFRESH_EXPIRES_IN: z.string().default('30'),
  JWT_TOKEN_EXPIRES_IN: z.string().default('15'),
});

const appSchema = z.object({
  APP_PORT: z.string().default('3003'),
  APP_HOST: z.string().default('0.0.0.0'),
});

const grpcSchema = z.object({
  GRPC_HOST: z.string().default('0.0.0.0'),
  GRPC_PORT: z.string().default('5001'),
  GRPC_PACKAGE: z.string(),

  SM_GRPC_HOST: z.string().min(1),
  SM_GRPC_PORT: z.string().min(1),
  SM_GRPC_PACKAGE: z.string().min(1),
});

const kafkaSchema = z.object({
  KAFKA_BROKER: z.string().min(1),
  KAFKA_GROUP_ID: z.string().min(1),
  KAFKA_CLIENT_ID: z.string().min(1),
  KAFKA_MECHANISM: z.string().min(1),
  KAFKA_USERNAME: z.string().min(1),
  KAFKA_PASSWORD: z.string().min(1),
  KAFKA_SSL: z.string().default('true'),
});

const combinedSchema = {
  KAFKA: kafkaSchema,
  GRPC: grpcSchema,
  APP: appSchema,
  JWT: jwtSchema,
};

type CombinedSchemaKey = keyof typeof combinedSchema;

type ConfigurationEnvs = {
  [key in CombinedSchemaKey]: z.infer<(typeof combinedSchema)[key]>;
};

const configuration = (): ConfigurationEnvs => {
  const logger = new LoggerService();

  return Object.keys(combinedSchema).reduce((acc, schema) => {
    const validate = combinedSchema[schema as CombinedSchemaKey].safeParse(
      process.env,
    );

    if (!validate.success) {
      logger.error(
        "Configuration environment doesn't match",
        validate.error.message,
        'Configuration Environment',
      );

      process.exit(1);
    }

    return {
      ...acc,
      [schema]: validate.data,
    };
  }, {} as ConfigurationEnvs);
};

export { configuration };
