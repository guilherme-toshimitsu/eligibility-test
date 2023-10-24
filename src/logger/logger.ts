import { format, transports } from 'winston';
import { WinstonModule } from 'nest-winston';

// import  { LoggingWinston } from "@google-cloud/logging-winston";
// TODO GCP STACKDRIVER -> ADD A Service Key and use its data on Env
// const loggingWinston = new LoggingWinston({
//   projectId: 'lemon',
//   keyFile: "key.json",
// });

const logger = WinstonModule.createLogger({
  level: 'info',
  format: format.combine(format.splat(), format.simple()),
  transports: [
    new transports.Console(),
    // ...(process.env.CLOUD_ENV === 'gcp' ? [loggingWinston] : []),
    new transports.File({
      filename: `logs/error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // logging all level
    new transports.File({
      filename: `logs/combined.log`,
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export { logger };
