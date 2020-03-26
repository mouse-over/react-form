import React from 'react';

import {storiesOf} from '@storybook/react';

import WrapperDecorator from "./WrapperDecorator";

import {action} from '@storybook/addon-actions';
import {FormField, Form} from "../src/components";
import {useFormContainer} from "../src";

const FormContainerWrapper = ({form, render}) => {
  const container = useFormContainer('auth', form);
  return render(container);
};

storiesOf('FormContainer', module)
    .addDecorator(WrapperDecorator)
    .add('authentication using controls', () => <Form
        onChange={action('onChange')}
        onSubmit={action('onSubmit')}
        validationRules={{
            auth: {
                children: {
                    username: {
                        required: true,
                        minLength: 4
                    },
                    password: {
                        required: true,
                        minLength: 4
                    }
                }
            }
        }}
        render={(form) => <FormContainerWrapper form={form}
                                                render={(form) => <>
                                                    <FormField
                                                        name={'username'}
                                                        label='Username'
                                                        elementType='text'
                                                        elementConfig={{
                                                            type: 'text',
                                                            placeholder: 'please provide username',
                                                        }}
                                                        form={form}/>
                                                    <FormField
                                                        name={'password'}
                                                        label='Password'
                                                        elementType='text'
                                                        elementConfig={{
                                                            type: 'text',
                                                            placeholder: 'please provide password',
                                                        }}
                                                        form={form}/>
                                                </>}>
        </FormContainerWrapper>}>
        <button type="submit" className="btn btn-primary">Sign in</button>
    </Form>);
