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
           <button type="submit" className="btn btn-primary">Sign in</button>
        </>}>
    </Form>)
    .add('authentication using render - outer submitted', () => <Form
        onChange={action('onChange')}
        onSubmit={action('onSubmit')}
        isSubmitted={true}
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
            <button type="submit" className="btn btn-primary" disabled={!form.validation.valid}>Sign in</button>
        </>}>
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
            <button type="submit" className="btn btn-primary" disabled={!form.validation.valid}>Sign in</button>
        </>}>
    </Form>)
    .add('with custom form groups', () => <Form
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
                groupContainer={CustomGroupContainer}
                renderLabelElement={renderLabel}
                elementConfig={{
                    type: 'text',
                    placeholder: 'please provide username',
                    className: 'input-sm form-control input-s-sm inline'
                }}
                form={form}/>
            <FormField
                name={['auth','password']}
                label='Password'
                elementType='text'
                groupContainer={CustomGroupContainer}
                renderLabelElement={renderLabel}
                elementConfig={{
                    type: 'text',
                    placeholder: 'please provide password',
                    className: 'input-sm form-control input-s-sm inline'
                }}
                form={form}/>
            <button type="submit" className="btn btn-primary" disabled={!form.validation.valid}>Sign in</button>
        </>}>
    </Form>)
    .add('custom rule in validationRules', () => <Form
        onChange={action('onChange')}
        onSubmit={action('onSubmit')}
        validationRules={{
            username: {
                required: true,
                minLength: 4
            },
            password: {
                required: true,
                minLength: 3,
                custom: {
                    message: 'Not foo',
                    validate: (value) => value === 'foo'
                }
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
            <button type="submit" className="btn btn-primary" disabled={!form.validation.valid}>Sign in</button>
        </>}>
    </Form>);


const renderLabel = ({label}) => <><small>{label}</small><br /></>;
const CustomGroupContainer = ({children}) => <label className='inline'>{children}</label>