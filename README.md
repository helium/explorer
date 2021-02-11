# Helium Blockchain Explorer

Code that powers the official [Helium Blockchain Explorer](https://explorer.helium.com/).

## Development and Contribution

Any and all contributions from the community are encouraged.

- Guidelines for how to contribute to this repository [are here](https://github.com/helium/explorer/blob/master/CONTRIBUTING.md).
- Discussion about the development and usage of the Helium Blockchain Explorer takes place in the [official Helium Discord Server](https://discord.gg/helium), specifically in the `#explorer-dev` channel. Join us!
- For a list of issues and prioritization, please go to our [Project page](https://github.com/orgs/helium/projects/9).

## Getting Started

1. First, clone the repository to your local machine and navigate into the folder. For example:

```bash
git clone https://github.com/helium/explorer.git
cd explorer
```

2. Second, install all the dependencies:

```bash
yarn
```

3. Edit your environment variables

- Open the `.sample.env` file located at the root of the project
- [Create a Mapbox account](https://account.mapbox.com/auth/signup/) and [copy your public access token](https://account.mapbox.com/access-tokens/)
- Paste it in place of `123` for the `NEXT_PUBLIC_MAPBOX_KEY` variable. That line should now look like this:

```
NEXT_PUBLIC_MAPBOX_KEY=pk.ey[...the rest of your access token...]
```

- Rename the file "`.env`" (delete "`.sample`" from the file name)

4. Then run the development server:

```bash
yarn dev
# or
npm run dev
```

And open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file and save your changes.

5. Create a new logically-named branch. For example:

```bash
git checkout -b witness-list-enhancements
```

6. Push your changes to GitHub and create a PR against the master branch, linking the PR to any relevant issues.

## Deploy with Docker

```bash
docker run -e NEXT_PUBLIC_MAPBOX_KEY="CHANGE_ME" -p 3000:3000 ftx514/helium-explorer:latest
```

You need to adapt your *NEXT_PUBLIC_MAPBOX_KEY* to run this container


## Questions

If you run into any issues or you have any questions about how to get started contributing, feel free to reach out on the #explorer-dev channel in [the official Helium Community Discord server](http://discord.gg/helium)!

## Learn More

This is a [Next.js](https://nextjs.org/) project.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
