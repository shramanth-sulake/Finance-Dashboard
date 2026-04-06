import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema<any>): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body;
            // req.query and req.params are often readonly in express, Object.assign works for mutation safely
            if (parsed.query) Object.assign(req.query, parsed.query);
            if (parsed.params) Object.assign(req.params, parsed.params);
            
            next();
        } catch (error) {
            next(error); 
        }
    };
};
