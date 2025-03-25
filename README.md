# Madden Draft Class Tools

This library provides functionality for reading and writing Madden NFL draft class files.

## Features

- Read draft class as JSON
- Write Madden draft class from JSON

## Supported Games
- Madden NFL 25

## Installation

1. Install the npm package:
    ```
    npm install madden-draft-class-tools
    ```
2. Run tests:
    ```
    mocha ./tests/*.spec.js
    ```

## Available Functions

### readDraftClass(filePath: string): Object
This function reads the Madden draft class file at `filePath` and returns the draft class as a JSON object, with the following general structure:
```
{
    "header": {
        // File header data, you shouldn't need to modify this
    },
    "prospects": [
        {
            "firstName": string,
            "lastName": string,
            "position": number,
            ...
        }
    ]
}
```

### writeDraftClass(draftClass: Object): Buffer
This function writes the draft class JSON object to the Madden draft class file format and returns the file buffer. The `draftClass` object should have the same structure as the object returned by `readDraftClass`.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

See the LICENSE file for license details.