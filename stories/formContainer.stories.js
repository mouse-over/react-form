import React from 'react';

import {storiesOf} from '@storybook/react';

import WrapperDecorator from "./WrapperDecorator";

import {action} from '@storybook/addon-actions';
import {FormField, Form} from "../src/components";

storiesOf('Form', module)
    .addDecorator(WrapperDecorator)
    .add('authentication using controls', () => <Form
        onChange={action('onChange')}
        onSubmit={action('onSubmit')}
        controls={{
            username: {
                label: 'Username',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'please provide username',
                },
                validation: {
                    required: true,
                    minLength: 4
                }
            },
            password: {
                label: 'Password',
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'please provide password'
                },
                validation: {
                    required: true,
                    minLength: 4
                }
            },
            'remember': {
                elementType: 'checkbox',
                elementConfig: {autoComplete: 'off'},
                label: 'Remember me'
            }
        }}>
        <button type="submit" className="btn btn-primary">Sign in</button>
    </Form>)
    .add('authentication using render', () => <Form
        onChange={action('onChange')}
        onSubmit={action('onSubmit')}
        validationRules={{
            username: {
                required: true,
                minLength: 4
            },
            password: {
                required: true,
                minLength: 4
            }
        }}
        render={(form) => <>
            <FormField
                name='username'
                label='Username'
                elementType='text'
                elementConfig={{
                    type: 'text',
                    placeholder: 'please provide username',
                }}
                form={form}/>
            <FormField
                name='password'
                label='Password'
                elementType='text'
                elementConfig={{
                    type: 'text',
                    placeholder: 'please provide password',
                }}
                form={form}/>
        </>}>
        <button type="submit" className="btn btn-primary">Sign in</button>
    </Form>)
    .add('authentication using render and nested names', () => <Form
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
        render={(form) => <>
            <FormField
                name={['auth','username']}
                label='Username'
                elementType='text'
                elementConfig={{
                    type: 'text',
                    placeholder: 'please provide username',
                }}
                form={form}/>
            <FormField
                name={['auth','password']}
                label='Password'
                elementType='text'
                elementConfig={{
                    type: 'text',
                    placeholder: 'please provide password',
                }}
                form={form}/>
        </>}>
        <button type="submit" className="btn btn-primary">Sign in</button>
    </Form>);
