import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof HttpException) {
          const status = err.getStatus();
          const response = err.getResponse() as { [key: string]: any };

          const formattedError = {
            statusCode: status,
            message: response.message || err.message || 'An error occurred',
            error: response.error || 'Error',
            path: context.getArgs()[3]?.fieldName || 'Unknown',
          };

          return throwError(() => new HttpException(formattedError, status));
        }

        return throwError(() => err);
      })
    );
  }
}
