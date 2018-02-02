---
title: "Diamond-Square In C#"
date: 2017-08-25T20:36:00+10:00
draft: false
tags: [ "csharp", "procedural", "generation", "fractals", "gamedev" ]
---

Fractals are cool! They’re indispensable for procedural generation - things like clouds, heightmaps, moisture maps etc.

They can make things like this:

![](/diamond-square/map.png)

With an accompanying heightmap (This is actually Simplex Noise from my current project):

![](/diamond-square/heightmap.png)

Unfortunately they can be pretty difficult to wrap your head around when getting started, there are a bunch of often-mentioned algorithms and techniques used to generate this stuff - Perlin Noise, Simplex Noise, Value Noise being a few, and they all have their pros and cons (value noise looks real bad though, so it’s mostly cons and latticing). I always wanted a really simple, easy to understand code example for learning the process, something directed towards procedural newbies that went in depth.

Most people end up recommending people new to procedural generation implement a variant of the [Diamond-Square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) first, and they’re right to do so because it’s easily the most simple one to understand.

I ended doing my research report for last semesters programming class on a it and used my implementation as a basis for generating a 2d grid-based map with biomes for my end of semester code project in the same subject. The report is pretty in-depth and is targeted at complete newbs, however it’s in Pascal using the obscure SwinGame library (made by my uni), and to be honest I think there are some huge flaws with the results (weird corner values for instance).

That being said, here’s the report: [http://jacobmilligan.github.io/procedural_generation/](http://jacobmilligan.github.io/procedural_generation/)

And the accompanying code: [https://github.com/jacobmilligan/procedural_generation/tree/master/code](https://github.com/jacobmilligan/procedural_generation/tree/master/code)

I still think it’s really useful for people struggling to wrap their heads around the process regardless of language and game framework.

However, I’ve been working on my C# project for this semesters programming class and wrote a Diamond-Square generator for it and it’s a sight better, a lot less weird artifacts and more flexible usage. Once again, my goal was to add tonnes of documentation so people still struggling to get what’s going on will get a good picture of everything. I didn’t end up using it, switching to a Simplex Noise variant, but nevertheless the class is still pretty useful.

The code is available on [Github](https://gist.github.com/jacobmilligan):

<script src="https://gist.github.com/jacobmilligan/4d2de48f82ab4f2bc287048dccc07cde.js"></script>

A few caveats with the class:

*   As it's a variant of Diamond-Square (Random Midpoint Displacement) it requires both the width and height to be the same - only even grids allowed
*   The size of the map must be a power of 2 otherwise the algorithm won't work
*   It wraps, allowing tiling, but only approximately (very close but with some weird stitching issues). This is just due to the way Diamond-Square works unfortunately.
