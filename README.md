**NOTE:** This project is no longer being maintained. If you are interested in takng over as maintainer, please contact me. Otherwise, feel free to fork!

# Style Master
Let’s face it — Sketch’s style organizer leaves a lot to be desired. When you want to apply whole scale changes to your shared style names, you’re faced with endless clicking and manual renaming.

With Style Master, you can rename all or some of your shared styles at once. With the power of regular expressions, you can even completely redesign the naming hierarchy. The possibilities are limitless.

## Install with Sketch Runner

With Sketch Runner, just go to the `install` command and search for `Style Master`. Runner allows you to manage plugins and do much more to speed up your workflow in Sketch. [Download Runner here](http://www.sketchrunner.com).

<a href="http://bit.ly/SketchRunnerWebsite"><img width="160" height="41" src="http://bit.ly/RunnerBadgeBlue"></a>

## Manual Installation
1. Go to the [latest release page](https://github.com/aparajita/sketch-style-master/releases/latest) and download `Styles Master.sketchplugin.zip`.
1. In Sketch, go to `Plugins > Manage Plugins...`, click on the gear icon, and select `Show Plugins Folder`.
1. Un-zip the downloaded zip archive and then double-click the `Style Master.sketchplugin` file to install it.

## Usage

Select `Plugins > Style Master > Rename Text Styles` or `Plugins > Style Master > Rename Layer Styles` to bring up the renaming dialog:

![](docs/dialog-start.png?raw=true)

The left side of the dialog controls the renaming process, and the right side displays a live preview of how the styles will be renamed. Initially the preview columns are sized to fit the width of the longest style name (plus some extra space), and the window is sized to fit the width of the preview. You may resize the window, however note that the width of the preview columns will not change.

**Note:** There are [key equivalents](#key-equivalents) for every item in the interface.

### Find field/options
Enter the text you wish to search for in the search field (big surprise!). By default, searching is case sensitive. If you want to do case-insensitive searching, check "Ignore case". As you type in the Find field, the preview dynamically updates to indicate which style names match.

![](docs/show-only-matching-styles.gif?raw=true)

By checking "Regular expression", you can specify any valid [Javascript regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern) in the Find field and use a [special replacement syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter) in the Replace field. This allows you to perform extremely sophisticated manipulation of the style names that would extremely tedious otherwise. For examples of using regular expressions, see the [Cookbook](#cookbook).

**Note:** If the regular expression is invalid (e.g. unmatched parentheses), it is displayed in red.

### Replace field
The text you enter here replaces (or removes, if empty) the portion of the style name matched by the Find field. Note that **all** occurrences of the matching text within a given name will be replaced. So, for example, a simple search for "Sm", replacing with "Lg", would rename "Smile / Center / Sm" to "Agile / Center / Sm". This is a case where using a regular expression is useful to ensure you match only certain portions of a style name.

**Note:** If the Replace field is empty and the current search matches **entire** style names, those styles will not be included when renaming is performed, and they are not included in the rename count. These non-renameable styles are indicated by `<empty>` in the “After” column of the preview.

### Preview info/options
Below the Find and Replace fields are items relating to the preview. The number of styles that will be renamed when the `Apply` or `Rename` buttons are clicked is displayed first, followed by options that control the preview display.

#### Show only matching styles
When this option is off, the preview displays all styles. This is useful when you are trying to figure out what to search for. As you type in the Find field, matching styles are displayed in bold in the "Before" column of the preview:

![](docs/all-styles.png?raw=true)

As you can see in the image above, "Dark" actually matched 33 styles, but only the first 5 are visible because the remaining 28 styles are much later in the style list. This is where the "Show only matching styles" option is useful. When this option is on, only matching styles are displayed in the preview:

![](docs/matching-styles.png?raw=true)

#### Autoscroll to first matching style
When this option is on (the default), as you type in the Find field, the first matching style is scrolled to the top of the preview. This makes it easy to see if you are matching the right styles.

However, there may be times when you don't want the preview to scroll as you type in the Find field. For example, you may be trying to match a style name with a long regular expression and you have to scroll to see the style name. In this case, turning the "Autoscroll to first matching style" option off allows you to keep the style name visible as you type.

### Preview
When the dialog first opens, the preview on the right side of the dialog displays all of your styles, sorted alphabetically (case is significant).

As you type in the Find field, matching styles are highlighted in bold in the “Before” column, with the renamed style  in the “After” column. As you type in the Replace field, the renamed style names update.

### Action buttons
| Button | Action |
| :--- | :--- |
| Cancel | Closes the dialog without making any changes. |
| Apply | Renames the matching styles without closing the dialog. |
| Rename | Renames the matching styles and closes the dialog. |

## Key equivalents
| Action | Keys |
|:---|:---|
| Toggle "Ignore case" | `⌘I` |
| Toggle "Regular expression" | `⌘R` |
| Toggle "Show only matching styles" | `⌘M` |
| Toggle "Autoscroll to first matching style" | `⌘S` |
| Perform rename | `⌘⇧A` |
| Perform rename and close the dialog | `Return` or `Enter` |
| Cancel and close the dialog | `Esc` or `⌘.` or `⌘W` |


## Cookbook
Here are some typical tasks you might want to perform with Style Master and how to accomplish them. All of them assume the “Regular expression” option is on.

**Note:** A great tool for testing out regular expressions (and for explaining what the regular expressions in these examples do) can be found at [regular expressions 101](https://regex101.com/#javascript).

---

### Changing the “/” style
Did you know that you can use spaces around the “/” characters used to create a hierarchy in text style, layer style, and layer names? It makes the full name much easier to read. It’s easy to do this:

| Find | Replace |
| :--- | :--- |
| `([^ ])/([^ ])` | `$1 / $2` |

---

### Rearrange the naming hierarchy
Let’s say you are using a template that orders the text styles in the following hierarchy:

```
Size (Body, H1, etc.)
  Weight (Regular, Semibold, etc.)
    Alignment (Left, Center, Right)
      Color
```

But you want to reverse the order of Alignment and Weight:

```
Size (Body, H1, etc.)
  Alignment (Left, Center, Right)
    Weight (Regular, Semibold, etc.)
      Color
```

Here’s how:

| Find | Replace |
| :--- | :--- |
| `^(.+?)\s*/\s*(.+?)\s*/\s*(.+?)\s*/\s*(.+)` | `$1 / $3 / $2 / $4` |

---

### Collapsing the naming hierarchy
Let’s say you have the same hierarchy as in the example above, but instead of reordering the Alignment and Weight, you want to combine the Alignment and Color into a single level. So instead of `Body / Regular / Left / Black` you want `Body / Regular / Left - Black`. This would be a soul-crushing task if you had to do it manually with dozens of styles.

Regular expressions to the rescue!

| Find | Replace |
| :--- | :--- |
| `^(.+?)\s*/\s*(.+?)\s*/\s*(.+?)\s*/\s*(.+)` | `$1 / $2 / $3 - $4` |

---

### Expanding the naming hierarchy
This is the opposite of collapsing the naming hierarchy. You have `Body / Regular / Left - Black` but you want `Body / Regular / Left / Black`.

Here’s how:

| Find | Replace |
| :--- | :--- |
| `- ([^-]+)$` | `/ $1`

## Acknowledgements
Special thanks to other members of the Sketch plugin community for their invaluable foundational work:

* Mathieu Dutour – [skpm](https://github.com/skpm/skpm)
* Matt Curtis – [MochaJSDelegate](https://github.com/matt-curtis/MochaJSDelegate)
* Roman Nurik – [Plugin nib support](https://github.com/romannurik/Sketch-NibUITemplatePlugin)
