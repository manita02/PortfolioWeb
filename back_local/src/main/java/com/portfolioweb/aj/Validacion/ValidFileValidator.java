package com.portfolioweb.aj.Validacion;

import com.portfolioweb.aj.Util.ArchivoUtil;
import java.util.Optional;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ValidFileValidator implements ConstraintValidator<ValidFile, byte[]> {

    private FileCategory category;

    @Override
    public void initialize(ValidFile constraintAnnotation) {
        this.category = constraintAnnotation.value();
    }

    @Override
    public boolean isValid(byte[] value, ConstraintValidatorContext context) {
        if (value == null || value.length == 0) {
            return true;
        }

        Optional<String> error = ArchivoUtil.validarBytes(value, category);
        if (!error.isPresent()) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(error.get())
                .addConstraintViolation();
        return false;
    }
}
