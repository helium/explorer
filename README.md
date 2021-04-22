# Helium Blockchain Explorer

Code that powers the official [Helium Blockchain Explorer](https://explorer.helium.com/).

## Development and Contribution

Any and all contributions from the community are encouraged.

- Guidelines for how to contribute to this repository [are here](https://github.com/helium/explorer/blob/master/CONTRIBUTING.md).
- Discussion about the development and usage of the Helium Blockchain Explorer takes place in the [official Helium Discord Server](https://discord.gg/helium), specifically in the `#explorer` channel. Join us!
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

## Styling

Right now, the Explorer is styled using a combination of the [Ant Design system](https://ant.design), [inline styles](https://www.w3schools.com/react/react_css.asp), and classes found in the `/styles/Explorer.css` file.

Ant Design is a really powerful way to quickly implement various complex UI elements that would take a long time to build manually (e.g.: tables with pagination, date pickers, search bars) as well as common UI elements that have a lot of nuance in functionality (e.g.: checkboxes, buttons, tooltips, etc.) But sometimes systems like Ant can be very limiting and opinionated when it comes to customizing those UI elements. And systems like Ant Design can also become hard to work with when something like their column and row system doesn't quite align with the way you think a layout should look, or you want to remove or add extra padding somewhere for example.

And on the other hand, inline styles are a nice option for keeping the styles attached to the JSX code, and for conditionally styling things based on some logic. But inline styles don't allow for media queries, which are increasingly necessary to create a good mobile-first experience.

As the Explorer website becomes more mature and the broader Helium product family adopts a more cohesive design, customizing UI elements in a consistent way across the Explorer will become more necessary, especially considering that around 50% of the Explorer's visitors are visiting from mobile devices. Because everything Helium makes is intended to become open-source over time, ensuring that the design stays consistent across the entire family of Helium products (the Hotspot app, Console, helium.com, etc.) can become difficult the more one-off solutions are used to fix specific UI problems.

So in order to help us minimize the following things in Explorer:

- hardcoded hex colors, font sizes, font weights, padding and margin values
- long CSS files with confusing media queries, inconsistent class and ID names
- one-off solutions to override or fight against design systems like Ant

we are trying out [TailwindCSS](https://tailwindcss.com/). There is a `/tailwind.config.js` file at the root of the project which defines things like the website's color palette, breakpoints (sm, md, lg, xl), and in the future, things like font sizes, font weights, spacing tokens, and whatever else makes sense to include.

Moving the Explorer's styling code to Tailwind will be a gradual transition, and it might turn out that Tailwind isn't the best fit for Explorer in the end, in which case this section of the README will be updated accordingly.

### How to use Tailwind

The Tailwind docs are a really great resource for getting up to speed quickly on the syntax, but here is a brief example to show the power of Tailwind. Something like this is common to see in the Explorer codebase right now:

```jsx
<div
  style={{
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#222E46',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 32px',
  }}
>
  <p
    style={{
      color: '#FFFFFF',
      fontSize: 16,
    }}
  >
    Example text
  </p>
  <p
    style={{
      color: '#EEEEEE',
      fontSize: 16,
    }}
  >
    Example text
  </p>
</div>
```

In Tailwind, the same code could be written like this:

```jsx
<div className="flex flex-row bg-navy-500 items-center justify-center max-w-xl mx-auto py-4 px-8">
  <p className="text-white">Example text</p>
</div>
```

But the real power of Tailwind shows when you want to change the styling between mobile and desktop screen sizes.

In the first code snippet above, to make the styling different between screen sizes, you'd need to do something like this:

```jsx
<div
  className='container'
  // ^^^ come up with a logical class name and add it
  style={{
    display: 'flex',
    flexDirection: 'row',
    // ^^^ delete this row
    backgroundColor: '#222E46',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 32px',
  }}>
```

and then add some CSS code like this:

```css
.container {
  flex-direction: row;
}

@media screen and (max-width: 576px) {
  .container {
    flex-direction: column;
  }
}
```

In Tailwind, you could accomplish the same thing without having to come up with a new class name or adding any CSS by simply changing the first few utility classes in the above div to read like this:

```jsx
<div className='flex flex-col sm:flex-row ...
```

That might seem confusing at first glance, but another reason Tailwind is powerful is because it encourages us as frontend developers to take a mobile-first approach when styling things. The above set of utility classes in plain English translates to:

```
flex direction is "column", but if the screen size is bigger than "small" (mobile), flex-direction is "row"
```

Another nice use case for Tailwind is styling things conditionally while keeping the design system tokens intact. For example:

```jsx
<p
  className={`font-bold text-xl ${
    status === 'online' ? 'text-green-400' : 'text-red-400'
  }`}
>
  {status}
</p>
```

The syntax takes some getting used to, and sometimes the class names can start to get unwieldy, but the utility class model fits really nicely with components, so any time you find yourself repeating a string of Tailwind utility classes is probably a good time to encapsulate that JSX as a component.

## Questions

If you run into any issues or you have any questions about how to get started contributing, feel free to reach out on the `#explorer` channel in [the official Helium Community Discord server](http://discord.gg/helium)!

## Learn More

This is a [Next.js](https://nextjs.org/) project.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
