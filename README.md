
![loomis_telescope_setting_circles](https://github.com/user-attachments/assets/dae6dcde-2740-4d3c-ac5c-bfbbbf1d022c)

# STAHR Setting Circles Helper

[![Python](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/jupyter-notebook-orange)](https://jupyter.org/)
[![License](https://img.shields.io/badge/license-CC%20BY--SA%204.0-green)](https://creativecommons.org/licenses/by-sa/4.0/)
[![GitHub issues](https://img.shields.io/github/issues/lukehollis/stahr-circlesetters)](https://github.com/lukehollis/stahr-circlesetters/issues) 
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1F3SD-m1iwgjMsEwkkqAkOm-y-3jtsy-6)

Helper script and animated version for setting circles on the Michael Telescope, based on circlesetter.py by Casey Murray '25. Contact stahrgazers@gmail.com for questions. Any errors in this version are mine. 

[Live Demo](https://lukehollis.github.io/stahr-circlesetters/)


## Features
- Resolves astronomical objects using SIMBAD and JPL Horizons.
- Calculates RA/DEC differences and apparent positions.
- Optional Moon distance calculations.
- Supports updating from files and verbose output.

## Installation
Requires Python 3.8+. Uses uv for package management.

First clone this repo, then run

```bash
uv sync
```

You will be able to use the environment to run the python notebook. 

## Usage
Run the Jupyter notebook `circlesetter.ipynb`. Configure variables in the notebook (e.g., targets, navobjs, time).

Example configuration:
- Set `targets_input = ['M51']`
- Set `navobjs_input = ['Arcturus']`
- Run cells to resolve and summarize.

For command-line style, use the original verison or adapt as needed.


![setting_circles_moon](https://github.com/user-attachments/assets/5102e0f7-bb36-4a9b-8123-954ba1507571)



## Live Setting Circles Frontend

The frontend provides a live, interactive 3D visualization of the Michael Loomis Telescope's setting circles. It's built with React and `three.js` (via `@react-three/fiber`).

The visualization is designed to use while you're in the observatory if you don't want to use the python script or notebook. 

You can also get up and running with the frontend by cd'ing to the client dir then running. 

```bash
pnpm i
``` 

and when the packages install, then

```bash
pnpm run dev
```

## Contributing
Feel free to modify and share, but credit STAHR (Student Astronomers at Harvard-Radcliffe). Again, any mistakes are mine. 

## Credits
- Original: Casey Murray '25
- STAHR: stahrgazers@gmail.com

Ad astra.

![michael_telescope_stahr](https://github.com/user-attachments/assets/69e526a2-c9bf-4d77-9289-70886cce3f82)
