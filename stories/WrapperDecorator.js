import React from 'react';

const WrapperDecorator = storyFn => <div className="panel">
    <div className="panel-body">{storyFn()}</div>
</div>;

export default WrapperDecorator;