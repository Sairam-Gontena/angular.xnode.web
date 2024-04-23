import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ErrorService } from "./error.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class ErrorHandlerService extends ErrorHandler {



constructor(private injector: Injector, private errorService: ErrorService) {
    super();
}

override handleError(error: Error | HttpErrorResponse) {
    super.handleError(error);

    // Inject prerequisite services
    this.injectServices();

    /*let name;*/
    let message;
    let code;
    let stackTrace;
    let name;

    // Detect Error type (server or client)
    // Server error
    if (error instanceof HttpErrorResponse) {
        name = this.errorService.getServerName(error);
        code = this.errorService.getServerCode(error);
        message = this.errorService.getServerMessage(error);
        stackTrace = this.errorService.getServerStack(error);

        // You should write code here to send error data to the server ...

        console.log('HTTP Error:', name, code, message, stackTrace)
        // Client error
    } else {
        name = this.errorService.getClientName(error);
        message = this.errorService.getClientMessage(error);
        stackTrace = this.errorService.getClientStack(error);


        // You should write code here to send error data to the server ...
        console.log('Console Error:', name, code, message, stackTrace)

    }
}

private injectServices(): void {
    this.errorService = this.injector.get(ErrorService);
}
}
