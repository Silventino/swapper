const isAuth = () => {
  // return async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const authorization = req.headers["authorization"];
  //     if (!authorization) {
  //       throw new HttpError(401, "Rota Privada.");
  //     }
  //     const token = authorization.split(" ")[1];
  //     const atomic = await getAtomicByToken(token);
  //     req.body.atomic = atomic;
  //     next();
  //   } catch (error) {
  //     res.status(error.code ?? 500).send(error.message);
  //     return false;
  //   }
  // };
};

export default isAuth;
