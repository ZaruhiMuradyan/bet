/**
 * Created by Dell on 6/29/2017.
 */
import React,{Component} from 'react';
import './App.css';

class All extends Component{
    constructor(){
        super()
        this.state={data: [],
                    body:[],
                    checkboxArray:[],
                    templateData:[],
                    disabled: true,
                    variable:false,
                    templateToBeSent: ''
        }
        this.inputChange=this.inputChange.bind(this);
        this.inputChange=this.inputChange.bind(this);
        this.isDisabled=this.isDisabled.bind(this);
        this.showTemplates=this.showTemplates.bind(this);
        this.templateOpen=this.templateOpen.bind(this);
        this.cancel=this.cancel.bind(this);
        this.send=this.send.bind(this);
        this.radioChange=this.radioChange.bind(this);
    }

    componentDidMount()
    {
        fetch('http://crmbetc.azurewebsites.net/api/contacts').then(
            response => response.json()).then(response =>
                            this.setState({data:response})
                            );
        fetch('http://crmbetc.azurewebsites.net/api/contacts').then(
            response => response.json()).then(response =>
                            this.setState({body:response})
                            );
        fetch('http://crmbetc.azurewebsites.net/api/templates').then(response => {
            if (response.ok ) {
                return response.json();
            }
        }).then(response => {
            this.setState({
                templateData: response
            })
        })
        console.log(this.state.templateData);
    }

    inputChange(event) {
        let inputId=event.target.id;
        let checkboxArray=this.state.checkboxArray;
        if(event.target.checked===true){
            checkboxArray.push(this.state.body[inputId]['GuID']);
            this.setState({checkboxArray:checkboxArray});
        }
        else{
                for(let i in checkboxArray){
                    if(checkboxArray[i]===this.state.body[inputId]['GuID']){
                        checkboxArray.splice(i,1);
                        console.log('hanec')
                    }
                }
        }
        console.log(checkboxArray);
        this.isDisabled(checkboxArray);
    }
    isDisabled(checkboxArray){
        if(checkboxArray.length>0){
            this.setState({disabled: false})
        }
        else{
            this.setState({disabled: true})
        }
    }
    templateOpen(){
        this.setState({variable:true});

    }
    showTemplates(){
        if(this.state.variable){
            let templateData=this.state.templateData;
            let templateNames=[];
            let templateIDs=[];
            for(let i in templateData){
                templateNames.push(templateData[i]['TemplateName']);
                templateIDs.push(templateData[i]['TemplateId']);

            }
            let templateMap=templateNames.map((templateNames,index)=>
            <label key={index} ><input type="radio" onChange={this.radioChange} name="theOneAndOnly" id={templateIDs[index]}/>
                {templateNames}<br/></label>);
            return (<div>
                        <form name="theOneAndOnly">
                            {templateMap}
                        </form>
                      <button onClick={this.send}>Send</button>
                      <button onClick={this.cancel}>Cancel</button>
                </div>)
        }
    }
    send(){
        let checkboxArray=this.state.checkboxArray;
        console.log(checkboxArray);

        fetch('http://crmbetc.azurewebsites.net/api/sendemails?template='+this.state.templateToBeSent,{method: "POST",
            headers: {'Accept': 'application/json','Content-Type': "application/json"},
            body : JSON.stringify(checkboxArray)
        }).then(response => {
            if (response.ok ) {
                this.setState({
                    successMessage: "Email has been sent successfully",

                })
            }
        })
    }
    radioChange(event){
        this.setState({templateToBeSent:event.target.id});
        console.log(event.target.id)

    }
    cancel(){}
    render(){
        // let x=this.state.templateData[1];
        // if(x.length>0){
        // console.log(x);
        // }x
        let headers=[];
        let header=this.state.data[0];
        for(let i in header){
            headers.push(i);
            headers.splice(5);
        }
        let headerMap=headers.map((headers,index)=>
            <th key={index}>{headers}</th>);

        let body=this.state.body;
        let bodyMap=body.map((body, index)=>
            <tr key={index}>
                <td ><input id={index} type="checkbox" onChange={this.inputChange}/></td>
                <td key={`${body['Full Name']}Full Name`}>{body["Full Name"]}</td>
                <td key={`${body['Company Name']}Company Name`}>{body["Company Name"]}</td>
                <td key={`${body['Position']}Position`}>{body["Position"]}</td>
                <td key={`${body['Country']}Country`}>{body["Country"]}</td>
                <td key={`${body['Email']}Email`}>{body["Email"]}</td>
            </tr>)

        return(<div>
                <table>
                    <thead>
                        <tr>
                            <th>Select</th>
                            {headerMap}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyMap}
                    </tbody>
                </table>
                <button onClick={this.templateOpen} disabled={this.state.disabled}> Send</button>
                {this.showTemplates()}
            </div>
        )
    }
}

export default All;