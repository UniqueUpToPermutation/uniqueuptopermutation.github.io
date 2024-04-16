---
title: "Paper: Coarse Proxy Reduced Basis Methods for Integral Equations"
excerpt: "In this paper, we present a novel method for building reduced basis models for integral equations. The method works by using a column-pivoted QR algorithm together with a coarse proxy model to select a skeleton training set and construct a reduced basis from this skeleton set. We combine this with a novel operator interpolation technique specifically designed for integral equations to overcome the typical challenges of model reduction for non-local operators. We demonstrate our results on integral equation formulations of the radiative transport equation and a boundary integral formulation of the Laplace equation."
coverImage: "/assets/blog/coarse-proxy/basis2.png"
date: "2019-01-15"
author:
  name: Philip A. Etter
  picture: "/assets/blog/authors/me_hires.jpg"
ogImage:
  url: "/assets/blog/coarse-proxy/basis2.png"
---

### Published in Journal of Computational Physics

[Paper Link $$\rightarrow$$](https://www.sciencedirect.com/science/article/abs/pii/S0021999122008981) $$\qquad$$ [Full Text $$\rightarrow$$](http://web.stanford.edu/~lexing/coarseproxy.pdf)

## Introduction

Many high-fidelity physics models require a huge amount of computing resources - think simulating the drag force across a whole airplane. Practically, this means that important tasks like uncertainty quantification and Bayesian inference are computationally intractable, since they require not just one, but many solves of the underlying high-fidelity model. Reduced order modelling techniques use data to build fast approximate models as substitutes the original high fidelity physics model. These approximate models are useful for the aforementioned situations where one needs to query the high fidelity physics model many times in succession for roughly similar parameters.

However, much of the research in model order reduction revolves around differential equations rather than integral equations. While differential equations are more widely used in general, there are many fields and situations in which integral equations may be preferable. This is for a number of reasons:


* Integral equations tend to be better conditioned.
* In fields involving wave propagation (electromagnetism, acoustics, etc.) one can often convert differential equations over the interior of a region into integral equations over the boundary - essentially reducing a sparse 3D problem into a dense 2D one.
* Analytic approximation techniques like fast multiple method can make evaluating integral operators very efficient; making them very suitable for iterative methods.

Therefore, given the utility of integral equations and the potential speed-up model order reduction offers for tasks like uncertainty quantification and Bayesian inference, and the fact that integral equations have been under-served by the model order reduction community at large, building model order reduction techniques for integral equations is a worthwhile task. In particular, in this paper, we focus on the classical reduced basis techniques.

## Reduced Basis Overview

The classical reduced basis method roughly boils down to the following scheme:

1. Suppose one has a (discrete PDE) linear algebra problem parameterized by a set of parameters $$\mu$$ (i.e., the shape of your airplane's wings, the scattering background of your problem, etc.). We write the mathematical problem as:

$$
\bf{A}(\mu) \bf{x}(\mu) = \bf{b}(\mu)
$$

2. (Offline) One isolates a collection of parameters $$\mu_1, ..., \mu_n$$​ and solve their corresponding problems to obtain $$\bf{x}(\mu_1),...,\bf{x}(\mu_n)$$. Note this is an expensive step but can be done offline

3. (Offline) One uses $$\bf{x}(\mu_1),...,\bf{x}(\mu_n)$$ to compute a reduced basis matrix $$\Phi$$.

4. (Online) For a new $$\mu'$$, we can solve the much lower dimensional Galerkin projection of the original problem:

$$
(\Phi^T \bf{A}(\mu') \bf{\Phi}) \bf{y} = \bf{\Phi}^T \bf{b}(\mu')
$$

And then approximate:

$$
\bf{x}(\mu') \approx \bf{\Phi} \bf{y}
$$

We can see an example of a reduced basis $$\bf{\Phi}$$ below, computed for an example 2D radiative transfer problem that we examine in the accompanying paper:

![basis](/assets/blog/coarse-proxy/basis.svg)

## Difficulties and Novel Contributions

There is a critical issue with mixing reduced basis methods and integral equations however. *Namely, most reduced basis techniques have been specially developed for the type of sparse operators that typically appear in differential equations problems*. The operators in the integral equations world are extremely dense in comparison and forming the reduced operator $$\bf{\Phi}^T \bf{A}(\mu') \bf{\Phi}$$ is difficult to do outright or using existing reduced basis techniques (discrete empirical interpolation, etc.).

There is also another issue: How to efficiently choose the samples $$\mu_1,...,\mu_n$$​? Our new method addresses both of these issues by introducing the idea of coarse proxy models.

A coarse proxy model for a physics model is essentially an a priori sloppy estimate of the output we care about. For example, instead of computing a solution on a 1024 x 1024 grid, we can compute a solution on a 64 x 64. The important part is that the coarse solution gives some impression as to the "important" parameter instances. By using a column pivoted QR factorization of these sloppy coarse outputs, we can identify the "important" parameters $$\mu_1,...,\mu_n$$ in the sample space and build a reduced basis model by solving the full physics model for each of these parameters. 

Furthermore, by explicitly assembling important samples of the dense corresponding operators $$\bf{A}(\mu_1),...,\bf{A}(\mu_n)$$) (which cannot be assembled in full). We can compute interpolation weights that we allow us to form reduced operators for new parameters $$\mu'$$ by interpolating explicitly computed reduced operators $$\bf{\Phi}^T\bf{A}(\mu_1)\bf{\Phi}, ..., \bf{\Phi}^T \bf{A}(\mu_n)\bf{\Phi}$$ by utilizing samples from of the dense operator $$\bf{A}(\mu')$$. This allows us to efficiently approximate new reduced operators.