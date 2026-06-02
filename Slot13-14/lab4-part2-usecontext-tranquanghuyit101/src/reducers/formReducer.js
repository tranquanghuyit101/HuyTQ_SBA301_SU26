import { validateField } from '../utils/validators'

export const initialState = {
  values: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  errors: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  touched: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  status: 'idle',
};

function validateAll(values) {
  return {
    fullName: validateField('fullName', values.fullName, values),
    email: validateField('email', values.email, values),
    password: validateField('password', values.password, values),
    confirmPassword: validateField('confirmPassword', values.confirmPassword, values),
  };
}

export function formReducer(state, action) {
  switch (action.type) {
    case 'CHANGE': {
      const { field, value } = action;
      const values = { ...state.values, [field]: value };
      const errors = { ...state.errors };

      if (state.touched[field]) {
        errors[field] = validateField(field, value, values);
      }

      if (field === 'password' && state.touched.confirmPassword) {
        errors.confirmPassword = validateField('confirmPassword', values.confirmPassword, values);
      }

      return {
        ...state,
        values,
        errors,
      };
    }

    case 'BLUR': {
      const { field } = action;
      const error = validateField(field, state.values[field], state.values);
      return {
        ...state,
        touched: {
          ...state.touched,
          [field]: true,
        },
        errors: {
          ...state.errors,
          [field]: error,
        },
      };
    }

    case 'VALIDATE_ALL': {
      const errors = validateAll(state.values);
      const hasError = Object.values(errors).some(Boolean);
      return {
        ...state,
        touched: {
          fullName: true,
          email: true,
          password: true,
          confirmPassword: true,
        },
        errors,
        status: hasError ? 'error' : state.status,
      };
    }

    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

