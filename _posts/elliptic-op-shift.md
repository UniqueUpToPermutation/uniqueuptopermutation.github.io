---
title: "Paper: Operator Shifting for Noisy Elliptic Operators"
excerpt: "In the computational sciences, one must often estimate linear model parameters from data subject to noise and uncertainty. In order to improve the accuracy of linear models with noisy parameters, we propose the operator shifting framework, a collection of easy-to-implement algorithms that augment a noisy inverse operator by subtracting an additional shift term. Akin to James-Stein estimation, this reduces both bias and variance in the estimate. We develop bootstrap Monte Carlo algorithms to estimate the required shift magnitude for optimal error reduction. We  also provide a set of numerical experiments on four different graph and grid Laplacian systems."
coverImage: "/assets/blog/elliptic-op/banner.png"
date: "2022-06-01"
author:
  name: Philip A. Etter
  picture: "/assets/blog/authors/me_hires.jpg"
ogImage:
  url: "/assets/blog/elliptic-op/banner.png"
---

### Published in Springer Research in the Mathematical Sciences

[Paper Link $$\rightarrow$$](https://link.springer.com/article/10.1007/s40687-023-00414-x) $$\qquad$$

## Introduction

In this paper, we examine linear systems corrupted by noise and consider the problem of how to improve the accuracy of linear solves using statistical techniques. In essence, we suppose that we have a linear system of the form
$$
\hat{\mathbf{A}} \hat{\mathbf{x}} = \mathbf{b} \,,
$$
where $\hat{\mathbf{A}}$ is a symmetric positive definite matrix sampled from a distribution $\mathcal{D}_\mu$ parameterized by a set of variables $\mu$. For example, $\hat{\mathbf{A}}$ may be the Hessian of a mini-batch of a machine learning optimization problem. Or perhaps, $\hat{\mathbf{A}}$ might be a scattering operator across an inhomogenous background medium, where $\mu$ represents the background. Our work assumes that while the true $\mu$ may be unknown (i.e., we only have access to a noisy sample $\hat{\mu}$ of $\mu$), we have a model for how the sample $\hat{\mu}$ may be produced from the ground truth $\mu$. The goal is then to try to approximate the solution of the "ground truth" linear system
$$
\mathbf{A} \mathbf{x} = \mathbf{b} \,,
$$
using only our noisy sample $\hat{\mathbf{A}}$ and the corresponding noisy parameters $\hat{\mu}$. 

In the literature there are a number of existing techniques for producing better $\mathbf{x}$ via regularization, i.e., instead of solving the linear problem
$$
\min_{\mathbf{x}} \frac{1}{2} \|\hat{\mathbf{A}} \mathbf{x} - \mathbf{b}\|^2 \,,
$$
we might instead solve the linear problem with regularization
$$
\min_{\mathbf{x}} \frac{1}{2} \|\hat{\mathbf{A}} \mathbf{x} - \mathbf{b}\|^2 + \|\mathbf{K} \mathbf{x}\|^2 \,,
$$
where $\mathbf{K}$ is an appropriate regularizer. It is common to have $\mathbf{K}$ be the result of a prior placed on $\mathbf{x}$ such that the result of the optimization problem above coincides with the maximum a posteriori (MAP) estimate of $\mathbf{x}$ -- see, for example, Tikhonov regularization. 

## Our Approach

In contrast, our paper considers the above problem from the point of view of statistical estimation of $\mathbf{A}^{-1}$. That is, instead of using the naive estimate $\mathbf{\hat{A}}^{-1}$ as our estimate of the solution operator $\mathbf{A}^{-1}$, we want to build a correction to the naive estimator which produces a uniformly better estimation error,
$$
\mathbb{E}_\mu \|\mathbf{\hat{A}}^{-1} + \beta \mathcal{K}(\mathbf{\hat{A}}) - A^{-1}\|_B^2 \leq \mathbb{E}_\mu \|\mathbf{\hat{A}}^{-1} - A^{-1}\|_B^2 \,,
$$
where $\|\cdot\|_B$ is an appropriate matrix norm, where the *shift operator* $\mathcal{K}(\mathbf{\hat{A}})$ is a matrix function of $\mathbf{\hat{A}}$ and the *shift factor* $\beta \in \mathbb{R}$ is a scalar quantity that determines the magnitude of the correction. In fact, this formulation supersedes the problem of estimating $\mathbf{x}$ itself because the estimation error of $\mathbf{x}$ is just the estimation error of $\mathbf{A}^{-1}$ under a correct choice of matrix norm. A scale-invariance analysis suggests that the $\mathcal{K}$ should be linear in $\mathbf{\hat{A}}$, and hence, we explicitly consider corrections of the form
$$
\mathcal{K}(\mathbf{A}^{-1}) = -\beta \mathbf{C} \mathbf{\hat{A}^{-1}} \mathbf{D} \,,
$$
where $\mathbf{C}, \mathbf{D} \in \mathbb{R}^{n \times n}$ are matrices. Of course, when $\mathbf{C} = \mathbf{D}$, we have the very simple form of isotropic scaling of $\mathbf{A}^{-1}$,
$$
\mathbf{A}^{-1} \rightarrow (1 - \beta) \mathbf{A}^{-1} \,.
$$
In this respect, the approach is reminiscent of [James-Stein estimation](https://en.wikipedia.org/wiki/James%E2%80%93Stein_estimator), except applied to matrix inverses instead of vector quantities. Like Stein estimation, the key to the approach is to try to estimate the shift factor $\beta^*$ which produces the largest reduction in estimation error,
$$
\min_{\beta} \mathbb{E} \|\mathbf{\hat{A}}^{-1} + \beta \mathcal{K}(\mathbf{\hat{A}}) - A^{-1}\|_B^2 \,,
$$

where $\|\cdot\|_B$ is an arbitrary matrix inner product norm. Why do we expect this procedure to be effective? Well, there are two fundamental reasons. One of them is related to James-Stein estimation and the other is a special property of the matrix inverse. 

![Jensen](/assets/blog/elliptic-op/jensen.png)

1. First, note that inversion is a convex operation. If we have a random variable $X$ and we use $1/X$ to attempt to estimate the quantity $1/\mathbb{E}[X]$, we will actually potentially overshoot by a very substantial amount, as seen in the figure above. Indeed, strict Jensen's inequality tells us that $\mathbb{E}[1 / X] > 1/\mathbb{E}[X]$. The same fact also applies to matrices. If $\hat{\mathbf{A}}$ and $\mathbf{A}$ are always positive semi-definite matrices, then it can be shown $\mathbb{E}[\hat{\mathbf{A}}^{-1}] \succeq \mathbf{A}^{-1}$ and hence the naive estimator will overshoot on average. We therefore interpret operator shifting as an attempt to correct this bias.

2. The second reason is the same reason why James-Stein estimation works. Recall that the error of an estimator can be decomposed into error from bias and error from variance (see [Bias-Variance Tradeoff](https://en.wikipedia.org/wiki/Bias%E2%80%93variance_tradeoff)). Therefore, not only can we expect operator shifting to not only reduce the bias of the naive estimator (as noted in (I)), but we can also expect it to reduce the variance as well! Furthermore, unlike the James-Stein setting, the reduction of bias and variance are not even in conflict with each other. In this sense, operator shifting is basically a free lunch as it works to reduce both bias and variance simultaneously.

Indeed, one of the fundamental results (Theorem 4.2) we show in the paper is that under mild assumptions one can expect an optimal shift factor to always fall within the range
$$
1 \geq \sqrt{\frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2}} \geq \beta^* \geq \frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2} \geq 0 \,.
$$
Note that the quantity $\frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2}$ is the ratio of the error of the naive estimator to its second moment. Furthermore, this range means that optimal operator shifts give a relative error reduction of at least
$$
\text{Relative Error Reduction} \geq \frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2} \,.
$$

## Estimating the Optimal Shift Factor $\beta$

Note that solving the fundamental optimization problem
$$
\min_{\beta} \mathbb{E} \|\mathbf{\hat{A}}^{-1} + \beta \mathcal{K}(\mathbf{\hat{A}}) - A^{-1}\|_B^2 \,,
$$
is unfortunately not possible because we do not know $\mathbf{\hat{A}}$. Our approach to produce an estimate of $\beta^*$ is to perform a bootstrap procedure: we treat $\mathbf{\hat{A}}^{-1}$ as the ground truth $\hat{A}^{-1}$ and then draw synthetic samples of $\mathbf{\hat{A}}^{-1}$ to obtain a Monte Carlo approximation of the above optimization function. Afterwards, optimization boils down to solving a quadratic in $\beta$, which can be done in closed form,
$$
\beta^* = \frac{\mathbb{E}\langle \mathcal{K}(\mathbf{\hat{A}}), \mathbf{\hat{A}}^{-1} - A^{-1}\rangle_B}{\mathbb{E}\|\mathcal{K}(\mathbf{\hat{A}})\|_B^2} \,.
$$

However, this quantity involves $\mathbf{\hat{A}}^{-1}$, which means that every Monte Carlo sample will require a full matrix solve of a new matrix. For many applications this can be prohibitively expensive. In the latter half of the paper we show that it is possible to build a series of monotonically increasing approximations $\beta^{(n)}$ to $\beta^*$ such that
$$
0 \leq \beta^{(2)} \leq \beta^{(4)} \leq \beta^{(6)} \leq ... \leq \beta^* \,,
$$
and that each $\beta^{(n)}$ only involves the term $A^{-1}$ and a polynomial of at least $n$ in $\mathbf{\hat{A}}$. This means that one can precompute a matrix inverse for $A^{-1}$ once and use it for each Monte Carlo sample, instead of recomputing $\mathbf{\hat{A}}^{-1}$ from scratch for each sample. This offers a substantial amount of compute time savings in estimating the optimal operator shift.

## Conclusion

We show in the paper that using this technique can substantial reduce error in a number of computations involving noisy Graph Laplacians. However, the scope of the paper is limited to elliptic (i.e., symmetric positive definite) operators. We also study the case of general matrices in a separate paper. Needless to say, the case of general matrices admits substantially less mathematical theory due to a number of interesting pathological cases that can cause strange behavior in the estimation problem. If the reader is interested, we recommend reading our blog post on the follow-up paper.