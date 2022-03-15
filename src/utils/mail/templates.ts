// create template based sender function
const  resetPasswordEmailTemplate = (transporter : any) => {
    return transporter.templateSender({
        subject: 'Rest your UPTO account password!',
        text: '',
        html: '<b>Hello, <strong>{{name}}</strong>,</b></p> <p> <a href="{{url}}"> Click this link to reset your password. </a> </p>'
    }, {
        from: 'UPTO {{senderEmail}}',
    });
}

const templates = {
    resetPasswordEmailTemplate
}

export default templates;
