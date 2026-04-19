import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppConstants as Constants } from './core/app.constants';
import { AppModule } from './core/app.module';
import { AppContextDataSource } from './data/data-source';
import { ExtendedValidationPipe } from './common/pipes/extended-validation.pipe';

async function bootstrap() {
	Logger.log(
		`Running ${process.env.npm_package_name} -${process.env.npm_package_version} on environment ${process.env.NODE_ENV}`
	);

	
	Logger.debug(`Running on development environment -- Database configuration: { host: ${process.env.DB_HOST}, port:${process.env.DB_PORT}, name: ${process.env.DB_NAME}}`);
	

	if (!AppContextDataSource.isInitialized) {
		await AppContextDataSource.initialize();
	}

	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix(Constants.APP_GLOBAL_PREFIX);

	const config = new DocumentBuilder()
		.setTitle(Constants.SWAGGER_TITLE)
		.setDescription(Constants.SWAGGER_DESCPTION)
		.setVersion(Constants.SWAGGER_VERSION)
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
				name: 'Authorization'
			},
			Constants.SWAGGER_ACCES_TOKEN
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/swagger', app, document);

	app.enableCors();
	// Use the extended validation pipe to skip validation for the @NoValidate decorator
	const reflector = app.get(Reflector);
	app.useGlobalPipes(new ExtendedValidationPipe(reflector));
	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
