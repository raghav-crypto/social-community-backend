import { Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";

const selectFields = (
  allowedFields: Record<string, string[]>,
  tableName: string
) => {
  return (req: SocialRequest, _res: Response, next: NextFunction) => {
    if (!req.query.select) {
      req.select = { id: true };
      return next();
    }

    if (req.query.select) {
      const requestedFields = (req.query.select as string)
        .split(",")
        .map((field: string) => field.trim());
      console.log("requested Fields", requestedFields);

      // Loop through each requested field and check if it's allowed for the given model
      const selectedFields: Record<string, string[]> = {};
      const tableFields: Record<string, boolean> = {};
      const errors: { message: string; field: string }[] = [];

      requestedFields.forEach((field: string) => {
        const [modelName, fieldName] = field.split(".");
        if (
          !allowedFields[modelName] ||
          !allowedFields[modelName].includes(fieldName)
        ) {
          errors.push({ message: `Invalid field: ${field}`, field });
        } else if (modelName === tableName) {
          tableFields[fieldName] = true;
        } else if (
          allowedFields[modelName] &&
          allowedFields[modelName].includes(fieldName)
        ) {
          if (!selectedFields[modelName]) {
            selectedFields[modelName] = [];
          }
          selectedFields[modelName].push(fieldName);
        }
      });

      if (errors.length) {
        return next(new ErrorResponse("error while parsing query", 400));
      }

      // Build the select object for Prisma based on the allowed fields
      const selectObj: Record<string, any> = {};
      for (const [modelName, fields] of Object.entries(selectedFields)) {
        if (fields.length > 0) {
          selectObj[modelName] = {
            select: {},
          };
          fields.forEach((fieldName) => {
            selectObj[modelName].select[fieldName] = true;
          });
        }
      }

      console.log({ ...selectObj, ...tableFields });
      req.select = { ...selectObj, ...tableFields };
    }

    return next();
  };
};

export default selectFields;
