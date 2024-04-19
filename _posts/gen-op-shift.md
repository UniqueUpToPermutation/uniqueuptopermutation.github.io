---
title: "Paper: Operator Shifting for General Noisy Linear Operators"
excerpt: "This paper is a follow-up paper to my other paper on operator shifting entitled 'Operator Shifting for Noisy Elliptic Systems'. Whereas the previous paper focused on the statistical problem of improving operator inverse estimates in the setting of elliptic (i.e., symmetric positive definite) matrix operators, this paper focuses on the same question when opened to more general matrices. Our approach is to extend the theory and examine if there are any cases where the lack of ellipticity renders the key theoretical results of the previous paper invalid. We identify the three pathological ways that the theory can break down to provide counter-intuitive results: anisotropy, extreme ill-conditioning, and asymmetric small noise. Finally, we show that in the absence of these pathologies one can recover the theory for elliptic operators."
coverImage: "/assets/blog/gen-op/titlecard.png"
date: "2022-08-01"
author:
  name: Philip A. Etter
  picture: "/assets/blog/authors/me_hires.jpg"
ogImage:
  url: "/assets/blog/gen-op/titlecard.png"
---

### Published in SIAM Journal on Mathematics of Data Science

[Paper Link $$\rightarrow$$](https://epubs.siam.org/doi/abs/10.1137/21M1416849) $$\qquad$$

## Introduction

This paper is a continuation of research from my previous paper on elliptic operator shifting, I would recommend reading [this blog post](/posts/elliptic-op-shift) first. Assuming that you are already familiar with the basics of operator shifting, allow me to quickly reintroduce the basic premise. First, we assume that we want to solve a linear system of the form
$$
\hat{\mathbf{A}} \hat{\mathbf{x}} = \mathbf{b} \,,
$$
where $\hat{\mathbf{A}}$ is a matrix sampled from a distribution $\mathcal{D}_\mu$ parameterized by a set of variables $\mu$. Unlike the previous setting where we assumed that $\hat{\mathbf{A}}$ was symmetric positive definite, in this paper, we make no such assumption. Operator shifting works by trying to find a good matrix shift $\beta \mathcal{K}(\hat{\mathbf{A}})$ and replace the naive estimator of the matrix inverse with a "shifted" version:
$$
\hat{\mathbf{A}}^{-1} \rightarrow \hat{\mathbf{A}}^{-1} - \beta \mathcal{K}(\hat{\mathbf{A}}) \,.
$$
In the case of elliptic operators, this shift has the effect of reducing both the bias and the variance of the estimator. This is due to an analogue of Jensen's inequality for matrix functions. However, the matrix variant of Jensen's inequality no longer holds for general matrix distributions, making the theoretical framework for operator shifting considerably weaker -- unless we make additional assumptions. A core goal of the paper, therefore, is to find a minimal set of additional assumptions that must be made before one can make mathematical guarantees about the efficacy of operator shifting.

In this post, I'll quickly summarize the three key counterexamples we present in the paper that may allow the theory to fail. Each of these three counterexamples elucidates a different mode of failure, and sheds some light onto the critical mathematical structure in elliptic matrices that is lost when moving to general matrices. In the subsequent content of this exposition, we will measure error as:
$$
\mathbb{E}\|(\hat{\mathbf{A}}^{-1} - \beta \mathcal{K}(\hat{\mathbf{A}})) - \mathbf{A}^{-1}\|^2 \,,
$$
where $\|\cdot\|$ is an arbitrary matrix inner product norm.

## The Elliptic Case

Recall, that for appropriate choice of $\mathcal{K}$ (in particular, the choice of $\mathcal{K} = \hat{\mathbf{A}}^{-1}$ that is the analogue of the [James-Stein estimator](https://en.wikipedia.org/wiki/James%E2%80%93Stein_estimator) for matrices) the optimal $\beta^*$ satisfied
$$
1 \geq \sqrt{\frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2}} \geq \beta^* \geq \frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2} \geq 0 \,.
$$
As well as
$$
\text{Relative Error Reduction} \geq \frac{\mathbb{E}\|\mathbf{\hat{A}}^{-1} - A^{-1}\|^2}{\mathbb{E}\|\mathbf{\hat{A}}^{-1}\|^2} \,.
$$
This means, roughly, that shrinking the operator $\hat{\mathbf{A}}^{-1}$ towards the origin is always a sensible move for elliptic matrices. Moreover, the amount of error reduction one can achieve is at least the ratio of the error to the second moment. We will see in the subsequent pathological case studies that this is (surprisingly) not true when one moves to general matrices.

## A Note on Matrix Inner Product Norms

 As it turns out, the choice of norm $\|\cdot\|$ becomes significantly more restricted for general matrices than for elliptic ones. In general, a matrix inner product norm $\|\cdot\| = \| \cdot \|_{\mathbf{M}, \mathbf{R}}$ will have the form
$$
\| \mathbf{X} \|^2_{\mathbf{M}, \mathbf{R}} = \mathbb{E}_{\mathbf{r} \sim P} \| \mathbf{X} \mathbf{r} \|_{\mathbf{M}}^2 \,,
$$
where $P$ is a vector distribution with second moment matrix $\mathbf{R}$ and $\|\cdot\|_\mathbf{M}$ is a vector norm induced by a positive definite matrix $\mathbf{M}$ (i.e., $\|\mathbf{x}\|_{\mathbf{M}} = \sqrt{\mathbf{x}^T \mathbf{M} \mathbf{x}}$). Thus, the matrix norm $\|\mathbf{X}\|$ measures the average length in the $\mathbf{M}$ vector norm of the image under $\mathbf{X}$ of a vector sampled from $P$. Note that the expectation can be written in closed form as
$$
\mathbb{E}_{\mathbf{r} \sim P} \| \mathbf{X} \mathbf{r} \|_{\mathbf{M}}^2 = \text{tr}(\mathbf{R}^{1/2} \mathbf{X}^T \mathbf{M} \mathbf{X} \mathbf{R}^{1/2}) \,.
$$
Note that when $\mathbf{R} = \mathbf{M} = \mathbf{I}$, this reduces to the Frobenius norm,
$$
\|\mathbf{X}\|_F^2 = \text{tr}(\mathbf{X}^T \mathbf{X}) = \sum_{ij} \mathbf{X}_{ij}^2 \,.
$$

It therefore possible for the distribution $P$ to favor some directions over others, in which case the matrix norm will place more weight on those directions. We call these situations *anisotropic*. It turns out that substantial anisotropy can destroy bounds on $\beta^*$. 

## Pathology #1: Anisotropy

For our first example to illustrate the importance of anisotropy, we take the ground truth to be $\mathbf{A} = \mathbf{I}$, and we let the noisy version of the operator be $\hat{\mathbf{A}} = \mathbf{A} + \hat{\mathbf{Z}}$, where $\hat{\mathbf{Z}}$ has two outcomes with equal probability:
$$
\mathbf{Z}_1 = \left[\begin{array}{cc} 0 & k \\ 0 & -k \end{array}\right], \qquad \mathbf{Z}_2 = \left[\begin{array}{cc} 0 & -k \\ 0 & k \end{array}\right] \,.
$$

One can run the numbers to see that the inverse $\mathbf{\hat{A}}^{-1}$ will always have the form:
$$
\mathbf{\hat{A}}^{-1} = \left[\begin{array}{cc} 1 & 1 \\ 0 & 0 \end{array}\right] + O(1/k) \,.
$$

If we take $P$ to be a singleton distribution with one atom at $\mathbf{b} = \left[\begin{array}{c} 2 \\ -1 \end{array}\right]$, then we happen to have that
$$
 \mathbf{\hat{A}}^{-1} \mathbf{b} = \left[\begin{array}{c} 1 \\ 0 \end{array}\right] + O(1/k), \qquad \mathbf{A}^{-1} \mathbf{b} = \left[\begin{array}{c} 2 \\ -1 \end{array}\right] \,.
$$
For the simple shift of $\mathcal{K} = \mathbf{\hat{A}}^{-1}$ and using L2 error $\mathbf{M} = \mathbf{I}$, the estimator error is given by
$$
\| (1 - \beta) \mathbf{\hat{A}}^{-1} \mathbf{b} - \mathbf{A}^{-1} \mathbf{b}\|^2_2 \,,
$$
the minimum error is achieved by $\beta^* = -1 + O(1/k)$, showing us the lack of isotropic can clearly generate a negative optimal shift factor. This means that in this situation, *it is actually optimal to grow the estimate $\mathbf{\hat{A}}^{-1}$ rather than shrink it!* In particular, one should note that without a requirement of positive-definiteness of $\mathbf{\hat{A}}$, it is possible to create a situation where $\mathbf{\hat{A}}$ is always "larger" than its expectation $\mathbf{A}$ in a specific direction. The anisotropic error measurement can then focus only on this direction and tell us that the optimal strategy is to grow the estimator rather than shrink it. This runs counter to the intuition behind operator shifting in the symmetric positive-definite case, where such a situation is not possible.

## Pathology #2: Outlier-Masking

The second pathology has to do with the lack of symmetry in the noise distribution. This can lead to an effect where outliers in the distribution can hide imbalances in the distribution closer to the mean, and these imbalances can be drastically amplified when the noisy matrix $\mathbf{\hat{A}}$ is inverted. For this example, consider $\mathbf{A} = \mathbf{I}$ and let the noisy version of the operator be $\hat{\mathbf{A}} = \mathbf{A} + \hat{\mathbf{Z}}$, where $\hat{\mathbf{Z}}$ has three outcomes with equal probability:
$$
    \mathbf{Z}_1 = \mathbf{I}, \qquad \mathbf{Z}_2 = k \mathbf{I}, \qquad \mathbf{Z}_3 = -(k + 1)\mathbf{I}  \,,
$$
The corresponding atoms of $\hat{\mathbf{A}}^{-1}$ are
$$
\mathbf{A}^{-1}_1 = \frac{1}{2} \mathbf{I}, \qquad \mathbf{A}^{-1}_2 = \frac{1}{k + 1} \mathbf{I}, \qquad \mathbf{A}^{-1}_3 = -\frac{1}{k} \mathbf{I} \,.
$$
For the simple shift of $\mathcal{K} = \mathbf{\hat{A}}^{-1}$ and using L2 error $\mathbf{M} = \mathbf{I}$, the estimator error is given by
$$
\begin{split}
&\| (1 - \beta) \mathbf{\hat{A}}^{-1} \mathbf{b} - \mathbf{A}^{-1} \mathbf{b}\|^2_2 \\
&\qquad = \frac{2}{3} \left(\frac{1 - \beta}{2} - 1\right)^2 + \frac{2}{3} \left(\frac{1 - \beta}{k + 1} - 1\right)^2 + \frac{2}{3} \left(-\frac{1 - \beta}{k} - 1\right)^2 \,.
\end{split}
$$
One can verify that by taking the derivative this reaches its minimum at $\beta^* = -1 + O(1/k)$. The message of this example is that *outliers in the matrix noise can mask distribution imbalances in the region near $\mathbf{A}$* that can cause $\mathbb{E}[\mathbf{\hat{A}}^{-1}]$ to both lie in the direction of $\mathbf{A}^{-1}$ while at the same time being dominated by $\mathbf{A}^{-1}$. Indeed, we have that $\mathbb{E}[\mathbf{\hat{A}}^{-1}] \approx \frac{1}{2} \mathbf{I} \preceq \mathbf{I} = \mathbf{A}^{-1}$ (it bears repeating that such a feat is impossible in the symmetric positive-definite setting where $\mathbb{E}[\mathbf{\hat{A}}^{-1}] \succeq \mathbf{A}^{-1}$). The importance of noise symmetry is that it forces the distribution of $\mathbf{\hat{Z}}$ to be balanced in the region around $\mathbf{A}$, even if the distribution contains large outliers.

## Pathology #3: Ill-Conditioning

The third and final pathology deals with the conditioning of the matrix $\mathbf{A}$ and measurement of the estimator error. It fundamentally arises from the fact that if $\mathbf{A}$ is very ill-conditioned, then measurement of the error
$$
\mathbb{E}_{\mathbf{r} \sim P} \| (1 - \beta) \hat{\mathbf{A}}^{-1} \mathbf{r} - \mathbf{A}^{-1} \mathbf{r}\|_2^2
$$
can place incredible weight on the direction of $\mathbf{A}$'s smallest singular vector. To see this play out, we consider $\mathbf{A}$ as the matrix:
$$
\mathbf{A} = \left[\begin{array}{cc}
        1 & - \epsilon \\
        \epsilon & 0 
    \end{array}\right] \,,
$$
where $0 < \epsilon \ll 1$. We take $\mathbf{\hat{A}} = \mathbf{A} + \mathbf{\hat{Z}}$ and for the noise $ \mathbf{\hat{Z}}$, we reuse the distribution from pathology #1:
$$
\mathbf{Z}_1 = \left[\begin{array}{cc} 0 & k \\ 0 & -k \end{array}\right], \qquad \mathbf{Z}_2 = \left[\begin{array}{cc} 0 & -k \\ 0 & k \end{array}\right] \,.
$$
The inverses then become approximately
$$
    \mathbf{A}^{-1}_1 \approx \left[\begin{array}{cc} 1 & 1 \\ -1 & 0 \end{array}\right]^{-1} = \left[\begin{array}{cc} 0 & 1 \\ -1 & 1 \end{array}\right], \qquad \mathbf{A}^{-1}_2 \approx \left[\begin{array}{cc} 1 & -1 \\ 1 & 0 \end{array}\right]^{-1} = \left[\begin{array}{cc} 0 & -1 \\ 1 & 1 \end{array}\right] \,.
$$
Whereas the ground truth is
$$
    \mathbf{A}^{-1} = \left[\begin{array}{cc}
        0 & -\epsilon^{-1}  \\
        \epsilon^{-1} & \epsilon^{-2} 
    \end{array}\right] \,.
$$
The error is given by:
$$
\frac{1}{2} \| (1 - \beta) \mathbf{A}^{-1}_1 - \mathbf{A}^{-1}\|_F^2 + \frac{1}{2} \| (1 - \beta) \mathbf{A}^{-1}_2 - \mathbf{A}^{-1} \|_F^2 \,,
$$
which means that the optimal $\beta^*$ must be of the order $\beta^* \sim \epsilon^{-2}$ as $\epsilon$ grows very small and the matrix $\mathbf{A}$ becomes very ill-conditioned. 

This example therefore demonstrates the importance of conditioning in the ground truth matrix $\mathbf{A}$. It is perfectly possible that $\mathbf{A}$ lies close to a singular matrix, while the outcomes of $\mathbf{\hat{A}}$ are moved away from singularity by the noise imparted by $\mathbf{\hat{Z}}$. If this is the case, $\mathbb{E}[\mathbf{\hat{A}}^{-1}]$ will be small in magnitude compared to $\mathbf{A}^{-1}$ and shrinking the operator $\mathbf{\hat{A}}^{-1}$ further will not reduce average error in the Frobenius sense.

Note that symmetric positive-definite setting avoids this issue, since if $\mathbf{\hat{A}}$ is symmetric positive-definite everywhere, it is impossible for $\mathbb{E}[\mathbf{\hat{A}}]$ to be close to the origin without a significant chunk of the probability distribution also lying close to the origin. This ensures that $\mathbb{E}[\mathbf{\hat{A}}^{-1}]$ will always spectrally dominate $\mathbf{\hat{A}}^{-1}$, and shifting the operator $\mathbf{\hat{A}}^{-1}$ towards $\mathbf{0}$ will reduce error.

Therefore, any theory regarding the optimality of shrinkage must somehow rule out this possibility. The solution is to counteract this ill-conditioning in the measurement norm $\mathbf{M}$. In contrast to the $L_2$ norm ($\mathbf{M} = \mathbf{I}$), note that the residual norm matrix $\mathbf{A}^T \mathbf{A}$ for this problem is given by
$$
\begin{equation}
    \mathbf{A}^T \mathbf{A} = \left[\begin{array}{cc}
        1 + \epsilon^2 & \epsilon  \\
        \epsilon & 0 
    \end{array}\right] \,.
\end{equation}
$$
Using the residual norm matrix changes the error measurement from the domain of $\mathbf{A}$ to the codomain,
$$
\| (1 - \beta) \mathbf{\hat{A}}^{-1} \mathbf{b} - \mathbf{A}^{-1} \mathbf{b} \|_{\mathbf{A}^T \mathbf{A}} = \| \mathbf{A} \mathbf{\hat{x}} - \mathbf{b}\|_2 \,,
$$
where $\mathbf{\hat{x}} = (1 - \beta) \mathbf{\hat{A}}^{-1} \mathbf{b}$ is our estimate for the solution of the linear system. The above quantity is often called the "residual" in linear algebra, hence the name of the norm, and it avoids the pitfalls discussed in this section. We remark that the residual norm is often used as an objective in nonsymmetric iterative methods.

## Main Theorem

The main theorem of our paper proves the positivity of the shift factor $\beta^*$ under the following assumptions:

1. **Mean-Zero Noise**: We assume that the noise matrix $\mathbf{\hat{Z}}$ is mean-zero, i.e., $\mathbb{E}[\mathbf{\hat{A}}] = \mathbf{A}$.
2. **Isotropy** (*Ruling out Pathology #1*): We assume that $\mathbf{R} = \mathbf{I}$. This means that there is no preferred direction in which we care about the accuracy of the estimation of the inverse.
3. **Noise Symmetry** (*Ruling out Pathology #2*): We assume that the distribution of the matrix $\mathbf{\hat{A}}$ is symmetric about its mean, namely that $\mathbf{\hat{Z}}$ has the same distribution as $-\mathbf{\hat{Z}}$.
4. **Residual Norm** (*Ruling out Pathology #3*): We specifically choose our vector norm of interest to be the residual norm $\mathbf{M} = \mathbf{A}^T \mathbf{A}$. 

**Main Theorem**: Under the assumptions (1) through (4) above, we always have $\beta^* \geq 0$. 

Note that this result is significantly weaker than the corresponding result for elliptic methods. Moreover, it is entirely possible to force $\beta^* = 0$ even under these constraints. The key to this would be to construct a matrix ensemble $\mathbf{A}^{-1}$ with the property that
$$
\mathbb{P} ( (\mathbf{\hat{A}} \mathbf{A}^{-1} - \mathbf{I})^T = -(\mathbf{\hat{A}} \mathbf{A}^{-1} - \mathbf{I})) = 1 \,
$$

However, if one rules out this weaker pathology, such that the probability of this even is not one, then we have a stronger version of the main theorem:

**Main Theorem (Alternate)**: Under the assumptions (1) through (4) above and $\mathbf{\hat{A}} \mathbf{A}^{-1} - \mathbf{I}$ isn't equal to its transpose almost surely, then we always have $\beta^* > 0$. 

However, even this stronger version doesn't provide error reduction guarantees in the same way that elliptic operator shifting does. This is because the asymmetry of the matrix $\mathbf{\hat{A}} \mathbf{A}^{-1} - \mathbf{I}$ is directly related to how well operator shifting will work -- the farther away $\mathbf{\hat{A}} \mathbf{A}^{-1} - \mathbf{I}$ is from its negative transpose, the more it is possible to de-bias the naive estimator $\mathbf{\hat{A}}$. The same pathology is again not possible in the elliptic case.
