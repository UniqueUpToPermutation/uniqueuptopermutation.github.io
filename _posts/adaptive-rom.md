---
title: "Paper: Adaptive Refinement and Compression for Reduced Models"
excerpt: "In this paper, we explore methods to efficiently guarantee accuracy and generalization for linear reduced models even when deployed on out-of-distribution problems. We equip reduced models with both a novel refinement mechanism (vector-space sieving), as well as a fast basis compression scheme; these two innovations together allow us to very quickly adapt a reduced model to new problem distributions. Finally, we demonstrate the effectiveness of our method on several partial differential equation problems."
coverImage: "/assets/blog/adaptive-rom/refinement_tree.png"
date: "2020-06-01"
author:
  name: Philip A. Etter
  picture: "/assets/blog/authors/me_hires.jpg"
ogImage:
  url: "/assets/blog/adaptive-rom/refinement_tree.png"
---

### Published in Computer Methods in Applied Mechanics and Engineering

[Paper Link $$\rightarrow$$](https://www.sciencedirect.com/science/article/abs/pii/S0045782520301146) $\qquad$

## Introduction

Model reduction is a data-driven technique for accelerating the computation of many-query high-fidelity physics problems such as Bayesian inference and uncertainty quantification (UQ). Typically, in a model reduction setting one wants to solve a collection of PDEs of the form
$$
\mathcal{L}(u_\mu^*(x); \mu) = 0 \,,
$$
where $\mathcal{L}$ is a differential or integral operator, $u_\mu^*(x)$ is a vector in an appropriate solution space, and $\mu$ is a parameterization of the problem. $\mu$ may describe anything from media of propagation to the geometry of a scene. In order to deploy reduced model reduction techniques to accelerate the task of computing many $u_\mu^*(x)$ at various $\mu$, one typically requires two things:

1. First, one requires an assumption of low dimensionality. That is, that the intrinsic dimension of the manifold the $u_\mu^*(x)$ lie on (parameterized by $\mu$) is well approximated by some low dimensional space. 
2. One has access to samples $u_\mu^*(x)$ from a representative distribution $\mathcal{D}$ to serve as training data for training.

However, in practice, ensuring that the training distribution in (2) is representative of the test distribution can be very difficult. There are a myriad of reasons for this: there are often subtle physics that can be missed while training, or the training set can be biased in some way, or maybe the underlying problem is sometimes subject to rare events -- either way, when ROMs encounter something during deployment that they have not been adequately trained for, the results can be disastrous (this is also true for data-driven machine learning techniques at large).

## A Simplified Example

In this example, we consider a simple Burger's Equation shock propagating in one dimension. As we see below, the shock moves from left to right during the simulation.

![](/assets/blog/adaptive-rom/fom.gif)

Now, suppose we take the first third of this simulation and use it to train a reduced model. Such a reduced model will work quite well for the left part of the domain above, but likely once the shock moves out of the region where training data is available, we enter a dangerous no-man's land. Take a look at the resulting simulated **reduced model** below:

![](/assets/blog/adaptive-rom/rom_bad.gif)

This unfortunate behavior is not surprising, once there is no longer training data to inform the physics of the shock, we just cannot expect a good result. Our work aims to provide reduced models with an efficient fallback solution for when this happens; ensuring we can still efficiently obtain high quality results without having to resort to solving the original equations. We do this by introducing two mechanisms: refinement, via vector-space sieving, and compression, via fast in-subspace PCA.

## Vector-Space Sieving

The workhorse of our refinement technique is vector-space sieving. While I will not delve too deep into this topic here, the essential idea is to recursively build a hierarchical decomposition of the full-order space that the underlying physics problem resides in (say $\mathbb{R}^n$). In our work, we build such a hierarchical decomposition from training data and the result is a *refinement tree* where every node of the tree corresponds to a subspace of $\mathbb{R}^n$ and children of a node satisfy mutual orthogonality and sum to their parent. This gives us something that looks like the image below:

![](/assets/blog/adaptive-rom/refinement_tree_with_label.png)

Of course, the way one chooses to decompose $\mathbb{R}^n$ is ultimately up to the user. In the above image the hierarchy is built with subsequent bandpass filters. But one could just as easily recurse by slicing vectors up into disjoint domains:

![](/assets/blog/adaptive-rom/refinement_tree_dirac_delta.png)

Either of these two methods demonstrates the key refinement technique: we can think of any hierarchical decomposition of $\mathbb{R}^n$ as a *sieve* (hence the name of the technique). By passing input vectors through the sieve through projection onto the children subspaces, we obtain a new set of vectors that spans a strictly larger space. Hence, reduced models after refinement will always have strictly greater model capacity than their predecessors. The crux of our technique is then to keep a separate refinement tree for each basis vector in our original reduced model. We see a representation of this below:

![](/assets/blog/adaptive-rom/sieve.png)

The final key in the technique is to use an error heuristic called **dual-weighted residual error indicators**,
$$
g(\bf{V}^h\hat{\bf{x}}^h) - g(\bf{V}^H \hat{\bf{x}}^H) \lessapprox \sum_{\mathbb{W} \in \text{Children}} \delta_{\mathbb{W}}^h \,.
$$
These indicators allow us to relate the potential reduction in error (left hand side) from a refinement to potential splits in the refinement tree (right hand side). Using these error indicators as our guide, we perform refinement until we recover a good solution. 

## Compression

Of course, performing too many refinements also means that the dimension of our model will grow considerably. Eventually this growth will become untenable. The second half our paper focuses on a fast basis compression method meant to condense all information obtained from successive basis refinement into a smaller, more efficient basis. The key to this is performing a PCA on new data that we have acquired from online simulation. However, since we know that this new data lies in a low dimensional subspace (namely, the subspace spanned by our refined basis vectors), we can actually perform this online training extremely quickly. Indeed, suppose you have a set of training data $\bf{X} \in \mathbb{R}^{m \times k}$ in a low dimensional space spanned by a basis $\bf{B} \in \mathbb{R}^{n \times m}$ where $n \ll m$. For a mean-zero PCA, we want to compute the singular value decomposition of
$$
\bf{B} \bf{X} = \bf{U} \bf{\Sigma} \bf{V}^T\,.
$$
But since the range of $\bf{U}$ is contained within the range of $\bf{B}$, there exists some lower dimensional $\bf{U}^* \in \mathbb{R}^{m \times m}$ (not necessarily orthogonal) such that $\bf{U} = \bf{B} \bf{U}^*$. Recall that the left singular $\bf{v}_1, \bf{v}_2, ...$ vectors satisfy
$$
    \max_{\|\bf{v}_i\|_2 = 1} \|\bf{B} \bf{X} \bf{v}_i \|_2 \,, \qquad \text{s.t. } \bf{v}_i \perp \bf{v}_j\,, \text{ for } j \leq i \,.
$$
This is of course the same as solving
$$
    \max_{\|\bf{v}_i\|_2 = 1} \|(\bf{B}^T \bf{B})^{1/2} \bf{X} \bf{v}_i \|_2 \,, \qquad \text{s.t. } \bf{v}_i \perp \bf{v}_j\,, \text{ for } j \leq i \,.
$$
It turns out (as we show in the paper) that is it possible to keep track of the $\bf{B}^T \bf{B} \in \mathbb{R}^{m \times m}$ term by only performing operations of order $m$. Furthermore, the right singular vectors $\bf{u}_i$ (i.e., the new basis vectors) and their low dimensional coordinate representations $\bf{u}_i = \bf{B} \bf{u}_i^*$ are given by
$$
\begin{split}
\bf{u}_i &= \frac{1}{\sigma_i} \bf{B} \bf{X} \bf{v}_i \,, \\
\bf{u}_i^* &= \frac{1}{\sigma_i} \bf{X} \bf{v}_i \,.
\end{split}
$$
Thus, by performing PCA on $(\bf{B}^T \bf{B})^{1/2} \bf{X}$ we can update our bases using new data very quickly without ever doing computations on the order of $n$. This is the core idea behind our basis compression algorithm.

![](/assets/blog/adaptive-rom/compression.png)

Compression therefore allows us to efficiently adapt reduced models to out-of-training distributions by supplementing the offline reduced model training with additional training that is done very efficiently online. We show in our paper that combining these two ideas leads to exciting reductions in average basis dimension over a baseline implementation of $h$-refinement for reduced models (an alternative reduced model adaptation method that is most comparable).