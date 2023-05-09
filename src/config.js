
const prod = {
    API_URL: ''
}
const dev = {
    API_URL: ''
}

const config = {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    // Default to dev if not set
    ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
};

export default config