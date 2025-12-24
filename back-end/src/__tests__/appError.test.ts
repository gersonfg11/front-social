import { AppError, errorHandler } from '../shared/middleware/errorHandler';

describe('AppError', () => {
  it('debe exponer mensaje y codigo de estado', () => {
    const error = new AppError('Mensaje de error', 418);

    expect(error.message).toBe('Mensaje de error');
    expect(error.statusCode).toBe(418);
  });
});

describe('errorHandler', () => {
  it('debe responder con el codigo y mensaje del AppError', () => {
    const error = new AppError('Algo sali mal', 400);

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res: any = { status };

    errorHandler(error, {} as any, res, {} as any);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Algo sali mal' });
  });
});
