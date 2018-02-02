---
title: "Skyrocket - Making a game engine made from scratch (Part 0)"
date: 2018-02-02T19:02:04+11:00
draft: true
tags: [ "c++", "gamedev", "graphics", "engine" ]
---

I'm by no means a super experienced graphics, gameplay, or engine programmer. In fact, until 2016 the only game-related projects I'd worked on were for Uni or were toy programs. Don't get me wrong, I have worked on **a lot** of toy projects but most of them were scrapped after the initial interest wore off.

However, in 2016, in the middle of my first year of Uni I got *really* into C++ and low-level programming in general and, figuring I'd pair that with my love of games I decided to start work on a big, proper project - a game built on a custom engine called [Skyrocket](https://github.com/jacobmilligan/Skyrocket) made from scratch. I wanted to do it truly from scratch as much as possible. No big dependencies - no SDL for windowing and input, no GLM for maths, no Intel TBB for task scheduling. And also release a game with it once I'd finished. 

Small goals, right?

# First, some background

> "That's insane and masochistic. The only way to actually *finish* a game is to use Unity or UE4."
> 
> -- *Someone on /r/gamedev, 2018. Probably*

Look, to be honest some days I really just want to fire up Unity or UE4 and actually start making a game and not have to worry about memory alignment issues, `- (void)ReallyAnnoyingObjectiveCMethodToTypeThatHas50Parameters`, deriving and testing linear algebra stuff, or `std::atomic` for the day . But thats only sometimes and I feel like the rewards for taking this path are huge. In fact, there are three big reasons I think that, at least for me, doing it like this is the only way forward:

1. **I want to be heaps better at programming** and writing a game engine from scratch touches on a large swathe of Computer Science areas, presenting countless architectural, algorithmic, and data structure problems along with learning how to deal with platform and language weirdness (because all languages have quirks - it's just that C++ is king quirk). So much so that it *force* you to get better at programming and software engineering in general in order to get anywhere - it's the wild west out here and there's no stackoverflow.com post with a solution for that one crash that only happens under macOS 10.11.4 when you press the tilde key to the rhythm of *Poison* by Bell Biv DeVoe.
2. **I want to be better at managing large projects**  - time management, complexity management & minimisation, and workflow management are all really important parts of writing software, and because game engines are so complex, developing one (especially from scratch) requires tight discipline in regards to those areas. By learning those skills, you learn to produce work faster, more consistently, and to a much higher standard while avoiding getting distracted or overwhelmed every five minutes.
3. **Making a game with your own engine is more fun**. Sometimes. If you built every last line of the engine yourself, you know *all* the quirks and you can add features without waiting or remove stuff you hate. You can make it as lightweight or complex as you want and at the end of the day you won't have to consult the docs every time you want to do something because you *wrote* the docs if you've been a good programmer and actually written some. That being said, you only have yourself to blame when the engine breaks so this last point is a bit take it or leave it for many people.

So while I want to release something, that's not the end goal of this project - it's a byproduct. The end goal is to learn a lot and improve as many skills as possible in the mean time while hopefully contributing a project to the Open-Source ether that people will get some use out of.

This post is going to be the first of hopefully a long series, maybe more of a stream of thought or series of desperate screams into the void, about the process of making a game and engine from scratch. In fact, my hope is for this to become something I wish I'd had when I started this process, especially for someone with very little experience - material from someone who was doing the same thing, the mistakes they made, the problems they faced, and how they solved them.

It's important to note that a lot of the posts to come will be *retrospectives* as I've completed a large chunk of the platform abstraction, render backend, and core libraries but once those posts have caught up, it'll all be *live* from then on out!

# Part 0 - So... Uh... Where do I start?

It's so easy when starting big projects to feel paralyzed by the tasks you've set out before you. Maybe you've drawn up a list of features and requirements and are just staring at them going "Cool, so now how do I actually *do* all this", or maybe you don't know enough about the projects goals to even draw up requirements properly.

For me, I'd drawn up a trello list of requirements and didn't know how to proceed from there at all as I'd never made an engine before and knew little about graphics API's and engine architecture. So, how *do* you work out where to start and how to implement everything if you don't know much about the problem domain? Well the answer sounds simple but surprisingly often I forget that this is key to doing new things:

***Research***

And I researched a lot. In the past I'd made a growing collection of crummy games with SFML and SDL and had made my way through the excellent [Learn OpenGL tutorials](https://learnopengl.com/) in order to get a handle on graphics API's so I knew enough to have a bit of a jump start.

In preparation, I made what turned out to be probably the single greatest book purchase ever - Jason Gregory's [Game Engine Architecture](http://gameenginebook.com/).

Reading through this book helped greatly for the next step I took in researching game engines - reading through existing open-source engines code bases. This is something that people often recommend against doing as you often don't have the whole picture as to the circumstances involved writing the code and can end up mimicking really specific or strange design decisions. 

I'm of the opposite opinion - I think it's invaluable. 

I think it teaches you a lot about general architecture of a game engine and techniques used to achieve certain things like designing platform abstraction layers. And after a while you start to see patterns repeated across different code bases - unspoken best practices - that become a useful kernel of knowledge to store in your mental toolbox.

## A starting point

While I was researching I was also experimenting by making little practice programs that put into practice my research. While this was helping me get a handle on things, I needed to actually *start* on something concrete at some point.

Jason Gregory has this really great picture in his book showing an overview of all the components most game engines are made up of:

{{< figure src="http://www.gameenginebook.com/img/fig-runtime-arch.jpg" caption="Source: http://www.gameenginebook.com/coursemat.html" >}}

So I figured that I'd start somewhere around the bottom bit and build the engine up from there knowing it wouldn't look at all like the above image but at least I had a starting point. So I started with arguably the least fun and most annoying part - the platform layer. But before that I realised after reading through the code bases of these enormous engine projects that I needed to sort something out that would be very hard to undo later and would influence the way the entire project was developed - I needed to make a decision on the **build system and project structure**.

## Build System

I'd done enough C++ projects by this stage to know that if I didn't work out a build system and project structure that I liked early on then as the project became more complex and my patience for fiddling with build rules waned, things would become really challenging.

For a bit of background, the C++ build ecosystem is insane and  the C++ dependency management ecosystem is insane and C++ build times are insane and in fact C++ itself is insane, but that's another story. There's a tonne of build systems out there and they're all crazy but whether C++ developers want to admit it or not, there's no denying that **CMake** has become the de-facto build system for open-source C++ projects. 

When I started learning C++ about two years ago I started using CMake by pure chance - I'd had enough of writing and navigating my super janky `build.sh` file and `make` really didn't feel like much of a better solution so I literally searched 'c++ alternatives to make' on google and clicked the first stackoverflow.com link and a few people mentioned CMake so I installed it and started learning it's whacky syntax. Since then, I've tried other build systems ([Bazel](https://bazel.build/) so far being the only one I'm still keeping an eye on) but none have really been solid enough in terms of features and support to replace CMake.

However, it did take me a while to work out how to make CMake bearable. It's really important to manage complexity in `CMakeLists.txt` files as they can quickly get unmaintainable in large projects. The easiest way to do this is to put a `CMakeLists.txt` at every project components root directory specifying build rules, sources, public/private directories, dependencies etc. related to that component. For instance, here's a partial tree for Skyrockets `Source` directory:

```sh
Source
├── CMakeLists.txt
└── Skyrocket
    ├── CMakeLists.txt
    ├── Core
    │   ├── CMakeLists.txt
    │   ├── Config.hpp
    │   ├── Containers
    │   │   ├── Buffer.hpp
    │   │   ├── ConditionalTypes.hpp
    │   │   ├── HandleTable.hpp
    │   │   └── MPSCQueue.hpp
......
```

The `CMakeLists.txt` at the root directory sets up a bunch of global definitions, setting etc. and then calls `add_subdirectory()` on `/Skyrocket` which calls `add_subdirectory()` on `/Core`, `/Graphics`, `/Platform` etc. which setup module specific rules in **their** `CMakeLists.txt` and then add sources from their subdirectories, some of which have large enough sub-components to have their own `CMakeLists.txt` to be added. I have a very simple function, `skyrocket_add_sources` which adds a list of source files relative to the current directory, turns them into absolute paths, and adds them to a global source list which looks like:

```cmake
# Adds source files to the projects global list
function(skyrocket_add_sources)
    set(srcs)
    foreach(s IN LISTS ARGN)
        if (NOT IS_ABSOLUTE "${s}")
            get_filename_component(s "${s}" ABSOLUTE)
        endif ()
        list(APPEND srcs "${s}")
    endforeach()

    set(skyrocket_sources ${skyrocket_sources} "${srcs}" CACHE INTERNAL "")
endfunction()
```

This helps with managing the CMake complexity, but what about the raw build complexity? What about things like build speeds?

The one thing I planned for sure from the outset was to design the project into modules. That is, each major component of the engine is built into a static library and then linked against the parent `Skyrocket` target. This way when something changes in one module, the only module that need compilation is the one that changed along with any library that depends on it. This usually saves on re-compilation of a bunch of code and has definitely lead to faster builds. As a side-note - at some point I should probably look into doing shared libraries instead of static ones to limit recompilation only to the library that changed and thus have faster compilation speeds, but I feel like linking would become a nightmare of dependency management and not sure if it's worth the pain.

As a bonus of organising the project into libraries, the relationship between modules became strictly hierarchical and lead to fewer inter-project dependencies and `#includes` which lead again to faster build times.

So by using CMake along with a set of quality-of-life CMake modules for adding sources/libraries and detecting platform stuff etc., a strict hierarchical relationship between modules, and the physical separation of modules into libraries, I feel like the project is very simple to build and maintain. This has gone on to be the only thing I got right the first time with Skyrocket - basically all other parts of the engine have so far required numerous iterations and I got almost nothing right the first time, but that's something I'll be talking about in later posts.

Next post I'll start talking about implementing the platform layer but for now I'll finish up here with a small list of the most useful resources I've found so far.

## Resources

Before I list the resources, I feel like everyone interested in doing this should watch a lot of [Handmade Hero](https://handmadehero.org/) episodes. If you've never seen it, please follow the list and skip through a few episodes, because Casey really knows his stuff and a lot of the techniques he talks about are used in some shape or form by all of the below engines.

Next, here's a list of awesome open-source game engine/graphics engine/media library projects to analyze:

* [UE4](https://www.unrealengine.com/en-US/ue4-on-github) (C++, Game engine)
* [Godot](https://github.com/godotengine/godot) (C++, Game engine)
* [Ogre3D](https://bitbucket.org/sinbad/ogre) (C++, Graphics engine)
* [GLFW](https://github.com/glfw/glfw) (C, Lightweight graphics and platform abstraction library for OpenGL and Vulkan)
* [SFML](https://github.com/SFML/SFML) (C++, Cross-platform multimedia library)
* [SDL](https://hg.libsdl.org/SDL) (C, Cross-platform multimedia library)
* [BGFX](https://github.com/bkaradzic/bgfx) (C/C++, Graphics library)
* [Banshee3D](https://github.com/BearishSun/BansheeEngine) (C++, Game engine)
* [MonoGame (previously XNA)](https://github.com/MonoGame/MonoGame) (C#, Game development framework and library)
* [libGDX](https://github.com/libgdx/libgdx) (Java, Game development framework and library)
* [LWJGL](https://github.com/LWJGL/lwjgl3) (Java, Multimedia library)

A list of books I read while researching and developing the engine:

* [Game Engine Architecture](http://gameenginebook.com/)
* [Real-Time Rendering](http://www.realtimerendering.com/)
* [Physically-Based Rendering](http://www.pbrt.org/)
* [Michael Abrash's Graphics Programming Black Book](https://www.amazon.com/Michael-Abrashs-Graphics-Programming-Special/dp/1576101746)
* [3D Math Primer for Graphics and Game Development](https://www.crcpress.com/3D-Math-Primer-for-Graphics-and-Game-Development-2nd-Edition/Dunn-Parberry/p/book/9781568817231)
* [Game Coding Complete](https://www.amazon.com/Game-Coding-Complete-Fourth-McShaffry/dp/1133776574)
* [Game Engine Gems volumes 1-3](http://www.gameenginegems.net/)
* [Frank Luna's D3D books](http://www.d3dcoder.net/)

And finally here's a list of blogs I read sporadically - some of which have some great game-related posts:

* [Fabien Sanglard](http://fabiensanglard.net/)
* [Molecular Musings](https://blog.molecular-matters.com/)
* [Bitsquid blog](http://bitsquid.blogspot.com.au/)
* [Fabien Giesen](https://fgiesen.wordpress.com/page/2/)
* [Our Machinery](http://ourmachinery.com/)
* [Dolphin Emulator dev blog](https://dolphin-emu.org/blog/) (I just like reading about the crazy stuff these guys have to do to get this thing running)


