import React from 'react';

export default class EmptyAlert extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p style={{margin:'30px', marginTop:'50px', fontSize: '18px', backgroundColor:'whitesmoke', borderRadius:'5px', padding:'10px'}}>
                {this.props.msg}
            </p>
        );
    }
}
