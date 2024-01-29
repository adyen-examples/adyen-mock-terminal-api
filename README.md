> [!IMPORTANT]
> This mock application is currently in its alpha-release and is not supporting every request and response.
> The current mock terminal supports requests for the following [Terminal API requests](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/):
> - [PaymentRequest](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexopaymentrequest) | [PaymentResponse](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexopaymentresponse) |  [PaymentBusyResponse](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexopaymentresponse) 
> - [ReversalRequest](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexoreversalrequest) | [ReversalResponse](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexoreversalresponse)
> - [AbortRequest](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexoabortrequest)
> - [TransactionStatusRequest](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexotransactionstatusrequest)  | [TransactionStatusResponse](https://docs.adyen.com/point-of-sale/design-your-integration/terminal-api/terminal-api-reference/#comadyennexotransactionstatusresponse)



# Adyen Mock Terminal Api Application
Adyen Mock Terminal API is a mock server that handles requests and responses from a POS device. 
Developers can use this to test their application quickly without having a physical POS device. 
Note that this application is not able to reject all invalid requests.

Currently, the Mock terminal is used to end-to-end test our In-Person Payments Integration Examples in [**.NET**](https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/in-person-payments-example), [**Java**](https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/in-person-payments-example) or [**Node.js**](https://github.com/adyen-examples/adyen-node-online-payments/tree/main/in-person-payments-example).


[![Run this application on Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/adyen-examples/adyen-mock-terminal-api)


## Limitations

## Prerequisites
- Node.js 18+ 

> We recommend to use an application that can send Terminal-API requests or one of our [**.NET**](https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/in-person-payments-example), [**Java**](https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/in-person-payments-example), [**Node.js**](https://github.com/adyen-examples/adyen-node-online-payments/tree/main/in-person-payments-example) example-integrations.

## 1. Installation

```
git clone https://github.com/adyen-examples/adyen-mock-terminal-api.git
```


## 2. Run the application

```
npm install
npm start
```

Visit [http://localhost:3000/](http://localhost:3000/) to see the mock Terminal API.

## 3. Usage

There are two ways in which you can use the application.

1. We recommend to clone on of our our In-Person Payment Integration examples in [**.NET**](https://github.com/adyen-examples/adyen-dotnet-online-payments/tree/main/in-person-payments-example), [**Java**](https://github.com/adyen-examples/adyen-java-spring-online-payments/tree/main/in-person-payments-example) or [**Node.js**](https://github.com/adyen-examples/adyen-node-online-payments/tree/main/in-person-payments-example).

Once you've cloned the example, you can point the application to use `http://localhost:3000`, this configurable by overriding the `CloudApiEndpoint` URI. Now your application is ready to communicate to the terminal


2. Alternatively, you can use this stand-alone application and send terminal API requests from within the application.


## Contributing

We commit all our new features directly into our GitHub repository. Feel free to request or suggest new features or code changes yourself as well!

Find out more in our [contributing](https://github.com/adyen-examples/.github/blob/main/CONTRIBUTING.md) guidelines.


## License

MIT license. For more information, see the **LICENSE** file.
