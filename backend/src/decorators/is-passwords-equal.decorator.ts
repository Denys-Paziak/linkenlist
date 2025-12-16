import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'
import { RegistrationDto } from '../modules/auth/dtos/Registration.dto'

@ValidatorConstraint({ name: 'IsPasswordsEqual', async: false })
export class IsPasswordsEqual implements ValidatorConstraintInterface {
	public validate(
		passwordConfirmation: string,
		validationArguments?: ValidationArguments
	): Promise<boolean> | boolean {
		const dto = validationArguments?.object as any

		return (passwordConfirmation === dto.password) || (passwordConfirmation === dto.newPassword)
	}

	defaultMessage(): string {
		return 'Passwords do not match'
	}
}
