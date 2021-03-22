import * as Yup from 'yup'
import { IntlShape } from 'react-intl/src/types'
import { Translator } from 'mui-rff/dist/Validation'
import { useIntl } from 'react-intl'
import { ErrorResponse } from '../api/fetchWrappers'
import { SubmissionErrors } from 'final-form'

Yup.setLocale({
  mixed: {
    default: 'invalid',
    required: 'required',
    oneOf: ({ oneOf }: { oneOf: any }) => ({ key: 'oneOf', values: { oneOf } })
  },
  string: {
    email: 'email',
    min: ({ min }: { min: any }) => ({ key: 'min', values: { min } })
  }
})

export function translateFormError (intl: IntlShape, prefix: string, field: string, errorName: string, values: { [id: string]: string } | undefined = undefined): string {
  const keys = [`${prefix}.${field}.${errorName}`, `${prefix}.Defaults.${errorName}`, `FormValidation.${field}.${errorName}`, `FormValidation.Defaults.${errorName}`]
  for (const key of keys) {
    if (intl.messages[key] !== undefined) {
      return intl.formatMessage({ id: key, defaultMessage: key }, values)
    }
  }
  return ''
}

const translator: (intl: IntlShape, prefix: string) => Translator = (intl, prefix) => (errorObj) => {
  const error = errorObj.errors[0] as string | { key: string, values: { [id: string]: string } }
  if (typeof error === 'string') {
    return translateFormError(intl, prefix, errorObj.path ?? 'default', error)
  } else {
    return translateFormError(intl, prefix, errorObj.path ?? 'default', error.key, error.values)
  }
}

export type ServerErrorTranslator = (response: ErrorResponse) => SubmissionErrors

export interface UseTranslator {
  translateServerErrors: ServerErrorTranslator
  translator: Translator
}

export function useTranslator (prefix: string): UseTranslator {
  const intl = useIntl()
  const translateServerErrors: ServerErrorTranslator = response => {
    const translatedErrors: SubmissionErrors = {}
    response.errors.forEach(error => {
      if (translatedErrors[error.attribute] === undefined) {
        translatedErrors[error.attribute] = []
      }
      if (Object.keys(error.options).length === 0) {
        translatedErrors[error.attribute].push(translateFormError(intl, prefix, error.attribute, error.type))
      } else {
        translatedErrors[error.attribute].push(
          translateFormError(intl, prefix, error.attribute, error.type, {
            key: error.type,
            values: error.options
          })
        )
      }
    })
    return translatedErrors
  }
  return {
    translateServerErrors,
    translator: translator(intl, prefix)
  }
}

export { translator }
