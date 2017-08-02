# duke-registration-enhancer

Chrome extension that enhances Dukehub's registration page by changing the page's appearance and adding features.

## Disclaimers

- This is a temporary extension. Eventually, the entire Duke registration site will be overhauled, be it in 6 months or 6 years. When that happens, the entire extension will be obsolete and need to be disabled or completely changed.

- This may unintentionally break functionality. There could be certain not well known features of the registration page that only a few students use. I cannot test every single button, so there is an unlikely possibility things may break.

- This may intentionally break functionality. There might be buttons I believe absolutely no one uses, so I will remove or change them. HOWEVER, if you actually miss them, please don't hesitate to contact me.

## Testing

To test the extension, go to `chrome://extensions`, enable developed and load unpacked extension. Select the `extension` folder.

To test the lambda server, install Serverless first; `npm install -g serverless` in command line. Next, navigate to the `lambda` folder and `npm install` there. Deploy the service with `serverless deploy -v`, or `serverless deploy function -f hello` for a single function. Invoke a function with `serverless invoke -f hello -l`. For more information, check out the [Serverless documentation](https://serverless.com/framework/docs/providers/aws/guide/quick-start/);

## Contributing

Fork, clone, create a new branch, add your changes, and submit a pull request. For adding a new feature, please create an option so users can toggle it on/off. To do this, make sure to modify `options.html`, `js/options.js` and `main.js`. Also, create a new Javascript file and add it to `manifest.json` to keep things neat.

## Contact

For questions and feedback, open an issue here or email me at wy35@duke.edu
