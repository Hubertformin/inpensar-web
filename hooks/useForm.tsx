import React, { useState } from "react";
import { omit } from "lodash";

const useForm = (initialValues = {}) => {
  //Form values
  const [values, setValues] = useState<any>(initialValues);
  //Errors
  const [errors, setErrors] = useState<any>({});

  const validate = (event, name, value) => {
    if (!value && name !== "notes") {
      let err = {
        ...errors,
        [name]: `${name} is required`,
      };

      setErrors(err);
      return err;
    } else {
      let newObj = omit(errors, name);
      setErrors(newObj);
      return null;
    }
  };

  const resetForm = (val) => {
    setValues(val);
  };

  function validateForm(): any {
    let err;
    Object.keys(values).forEach((key, index) => {
      const itemError = validate(null, key, values[key]);
      if (itemError) err = itemError;
    });
    return err;
  }
  // switch (name) {
  //     case 'email':
  //         if(
  //             !new RegExp( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)
  //         ){
  //             setErrors({
  //                 ...errors,
  //                 email:'Enter a valid email address'
  //             })
  //         }else{
  //
  //             let newObj = omit(errors, "email");
  //             setErrors(newObj);
  //
  //         }
  //         break;
  //     default:
  //         break;
  // }

  //A method to handle form inputs
  const handleChange = (event) => {
    //To stop default events
    if (event.persist) {
      event.persist();
    }

    let name = event.target.name;
    let val = event.target.value;

    validate(event, name, val);

    //Let's set these values in state
    setValues({
      ...values,
      [name]: val,
    });
  };

  return {
    values,
    errors,
    handleChange,
    validateForm,
    resetForm,
  };
};

export default useForm;
