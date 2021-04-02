import { DynamicModule, Global, Module } from "@nestjs/common";
import { CONFIG_OPTIONS, GCS_BUCKET } from "src/common/common.constants";
import { FileModuleOptions } from "./file.interface";
import { FileService } from "./file.service";
import { Storage } from "@google-cloud/storage";
import { FileController } from "./file.controller";

@Module({})
@Global()
export class FileModule {
    static forRoot(options: FileModuleOptions): DynamicModule {
        return {
            module: FileModule,
            exports: [FileService],
            providers: [
                FileService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                {
                    provide: GCS_BUCKET,
                    useFactory: async () => {
                        const gcsBucket = new Storage().bucket("plog-upload-2021-04-01");

                        return gcsBucket;
                    }
                }
            ],
            controllers: [FileController]
        };
    }
}
