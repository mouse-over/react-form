import React, {useState} from 'react';

import { storiesOf } from '@storybook/react';

import {FieldGroup} from "../src/components";
import WrapperDecorator from "./WrapperDecorator";

const InputHoc = ({value:inValue, ...props}) => {
    const [value, setValue] = useState(inValue);
    return <><FieldGroup label="Label " name="test"  {...props} onChange={(inputValue) => setValue(inputValue)} value={value}/> <pre>{value}</pre></>;
};


storiesOf('Inputs', module)
    .addDecorator(WrapperDecorator)
    .add('text', () => <InputHoc value={null} elementType="text"/>)
    .add('checkbox', () => <InputHoc value={false} elementType="checkbox"/>)
    .add('select', () => <InputHoc value={'one'} elementType="select" options={ [
        {value: 'one', label: 'One'},
        {value: 'two', label: 'Two'},
        {value: 'three', label: 'Three'},
    ]}/>)
    .add('textArea', () => <InputHoc value={null} elementType="textarea"/>);
