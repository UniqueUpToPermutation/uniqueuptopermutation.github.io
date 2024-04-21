---
title: "Paper: Accelerating Inference for Sparse XMR Trees"
excerpt: "Tree-based models underpin many modern semantic search engines and recommender systems due to their sub-linear inference times. In industrial applications, these models can operate at extreme scales, where every bit of performance is critical. In this paper, we develop a sparse linear algebra technique we call MSCM (masked sparse chunk multiplication). This technique is specifically tailored to sparse extreme multilabel ranking (XMR) trees and consistently dramatic speedups across both the online and batch inference settings. We apply MSCM to an enterprise-scale semantic product search problem with 100 million products and achieve sub-millisecond latency of 0.88 ms per query on a single thread — an 8x reduction in latency over vanilla inference techniques."
coverImage: "/assets/blog/sparse-xmr/bisection-clustering.png"
date: "2020-08-01"
author:
  name: Philip A. Etter
  picture: "/assets/blog/authors/me_hires.jpg"
ogImage:
  url: "/assets/blog/sparse-xmr/bisection-clustering.png"
---

### Published in the Proceedings of the Web Conference 2022

[Paper Link $\rightarrow$](https://dl.acm.org/doi/10.1145/3485447.3511973) $\qquad$ [Preprint $\rightarrow$](https://arxiv.org/pdf/2106.02697.pdf)

## Introduction

In this paper we study how to accelerate inference for sparse extreme multi-label ranking (XMR) tree models. Tree-based models are the workhorse of many modern search engines and recommender systems. Tree-based models have many advantages over their neural network counterparts. First, they are extremely fast to train: many models can be trained in minutes as opposed to days for neural networks. They are also very quick when it comes to inference, as the bulk of the inference consists of sparse linear algebra multiplications. Furthermore, they also take up substantially less memory. In enterprise-scale applications, these benefits mean tremendous savings in compute and storage. However, there is always room for improvement. In particular, while the scientific community has devoted much attention to the optimization of dense linear algebra kernels for neural networks, they have devoted significantly less attention to the optimization of sparse linear algebra kernels for tree-based models. In order to fill this gap in the literature, we will propose a class of sparse linear algebra kernels that we call *masked sparse chunk multiplication* (MSCM) techniques. These kernels are tailored specifically for XMR tree models and drastically improve performance anywhere from x8 to x20 on our benchmark models. The technique drives inference for Amazon's [Predictions for Enormous and Correlated Output Spaces (PECOS)](https://github.com/amzn/pecos) model framework, where it has significantly reduced the cost of both online and batch inference.

## Extreme Multi-Label Ranking Trees

An XMR problem can be characterized as follows: given a query $\mathbf{x}$ from some embedding $\mathbb{R}^d$ and a set of labels $\mathcal{Y}$, produce a model that gives an (implicit) ranking of the relevance of the labels in $\mathcal{Y}$ to query $\mathbf{x}$. In addition, for any query $\mathbf{x} \in \mathcal{X}$, one must be able to efficiently retrieve the top $k$ most relevant labels in $\mathcal{Y}$ according to the model --- noting that $d$ is typically very large and $\mathbf{x}$ very sparse. 

![](/assets/blog/sparse-xmr/bisection-clustering.png)

A linear XMR tree model is a hierarchical linear model that constructs a hierarchical clustering of the labels $\mathcal{Y}$, forming a tree structure. These clusters are denoted $\mathcal{Y}_i^{(l)}$, where $l$ denotes the depth (i.e., layer) of $\mathcal{Y}_i^{(l)}$ in the model tree and $i$ denotes the index of $\mathcal{Y}_i^{(l)}$ in that layer. The leaves of the tree are the individual labels of $\mathcal{Y}$.

Every layer of the model has a ranker model that scores the relevance of a cluster $\mathcal{Y}_i^{(l)}$ to a query $\mathbf{x} \in \mathcal{X}$. This ranker model may take on different forms, but for this paper we assume that the model is logistic-like. This means that, at the second layer, for example, the relevance of a cluster $\mathcal{Y}_i^{(2)}$ is given by
$$
f(\mathbf{x}, \mathcal{Y}_i^{(2)}) = \sigma\left(\mathbf{w}^{(2)}_{i} \cdot \mathbf{x} \right) \,,
$$
where $\sigma$ denotes an activation function (e.g., sigmoid) and $\mathbf{w}^{(2)}_{i} \in \mathbb{R}^d$ denotes a very sparse vector of weight parameters.

At subsequent layers, rankers are composed with those of previous layers, mimicking the notion of conditional probability; hence the score of a cluster $\tilde{\mathcal{Y}} \subset \mathcal{Y}$ is defined by the model as
$$
f(\mathbf{x}, \tilde{\mathcal{Y}}) = \prod_{\mathbf{w} \in \mathcal{A}(\tilde{\mathcal{Y}})} \sigma \left( \mathbf{w} \cdot \mathbf{x} \right) \,,
$$
where $\mathcal{A}(\tilde{\mathcal{Y}}) = \{ \mathbf{w}^{(l)}_{i} \mid \tilde{\mathcal{Y}} \subset \mathcal{Y}^{(l)}_{i}, l \neq 1 \}$ denotes all tree nodes on the path from $\tilde{\mathcal{Y}}$ to the root $\mathcal{Y}$ (including $\tilde{\mathcal{Y}}$ and excluding $\mathcal{Y}$). Naturally, this definition extends all the way to the individual labels $\ell \in \mathcal{Y}$ at the bottom of the tree. We assume here for simplicity that the leaves of the tree all occur on the same layer, but the techniques described in this paper can be extended to the general case.

As a practical aside, the column weight vectors $\mathbf{w}^{(l)}_{i}$ for each layer $l$ are stored in a $d \times L_l$ weight matrix
$$
\mathbf{W}^{(l)} = \left[\begin{array}{cccc} \mathbf{w}^{(l)}_{1} & \mathbf{w}^{(l)}_{2} & ... & \mathbf{w}^{(l)}_{L_l} \end{array}\right] \,,
$$
where $L_l$ denotes the number of clusters in layer $l$. The tree topology at layer $l$ is usually represented using a cluster indicator matrix $\mathbf{C}^{(l)}$. $\mathbf{C}^{(l)} \in \{0, 1\}^{L_{l + 1} \times L_{l}}$ is defined as
$$
\mathbf{C}^{(l)}_{ij} = \text{bool}(\mathbf{C}^{(l+1)}_{i} \subset \mathbf{C}^{(l)}_{j})\,,
$$
i.e., it is one when $\mathbf{C}^{(l+1)}_{i}$ is a child of $\mathbf{C}^{(l)}_{j}$ in the tree. Here, $\text{bool}(\cdot)$ is $1$ when the condition $\cdot$ is true and $0$ otherwise.

## Inference and Beam Search

In general, there are two different inference settings:

1. **Batch Inference**: inference is performed for a batch of $n$ queries represented by a sparse matrix $\mathbf{X} \in \mathbb{R}^{n \times d}$ where every row of $\mathbf{X}$ is an individual query $\mathbf{x}_i$.
2. **Online Inference**: a subset of the batch setting where there is only one query, e.g., the matrix $\mathbf{X}$ has only one row.

When performing inference, the XMR model $f$ prescribes a score to all query-cluster pairs $(\mathbf{x}_i, \mathcal{Y}_j^{(l)})$. Hence, in the batch setting, one can define the prediction matrices,
$$
\mathbf{P}^{(l)}_{ij} = f(\mathbf{x}_i, \mathcal{Y}_j^{(l)}) = \prod_{\mathbf{w} \in \mathcal{A}(\mathcal{Y}_j^{(l)})} \sigma \left( \mathbf{w} \cdot \mathbf{x}_i \right)  \,.
$$
The act of batch inference entails collecting the top $k$ most relevant labels (leaves) for each query $\mathbf{x}_i$ and returning their respective prediction scores $\mathbf{P}^{(l)}_{ij}$.

However, the act of exact inference is typically intractable, as it requires searching the entire model tree. To sidestep this issue, models usually use a greedy beam search of the tree as an approximation. For a query $\mathbf{x}$, this approach discards any clusters on a given level that do not fall into the top $b \geq k$ most relevant clusters examined at that level. Hence, instead of $\mathbf{P}^{(l)}$, we compute **beamed** prediction matrices $\tilde{\mathbf{P}}^{(l)}$, where each row has only $b$ nonzero entries whose values are equal to their respective counterparts in $\mathbf{P}^{(l)}$.

## Masked Sparse Chunk Multiplication

Our contribution is a method of evaluating masked sparse matrix multiplication that leverages the unique sparsity structure of the beam search to reduce unnecessary traversal, optimize memory locality, and minimize cache misses. The core prediction step of linear XMR tree models is the evaluation of a masked matrix product, i.e.,
$$
\mathbf{A}^{(l)} = \mathbf{M}^{(l)} \odot (\mathbf{X} \mathbf{W}^{(l)}) \,,
$$
where $\mathbf{A}^{(l)} \in \mathbb{R}^{k \times L_l}$ denotes ranker activations at layer $l$, $\mathbf{M}^{(l)} \in \{0, 1\}^{d \times L_l}$ denotes a dynamic mask matrix determined by beam search, $\mathbf{X} \in \mathbb{R}^{n \times d}$ is a sparse matrix whose rows correspond to queries in the embedding space, $\mathbf{W}^{(l)} \in \mathbb{R}^{n \times L_l}$ is the sparse weight matrix of our tree model at layer $l$, and $\odot$ denotes entry-wise multiplication.

Observations in the paper about the structure of the sparsity of $\mathbf{M}^{(l)}$ and $\mathbf{W}^{(l)}$ lead to the idea of the **column chunked matrix** data structure for the weight matrix $\mathbf{W}$. In this data structure, we store the matrix $\mathbf{W} \in \mathbb{R}^{d \times L_l}$ as a horizontal array of *matrix chunks* $\mathbf{K}^{(i)}$,
$$
    \mathbf{W}^{(l)} = \left[\begin{array}{cccc} \mathbf{K}^{(1)} & \mathbf{K}^{(2)} & ... & \mathbf{K}^{(L_{l - 1})} \end{array} \right] \,,
$$
where each chunk $\mathbf{K}^{(i)} \in \mathbb{R}^{d\times B}$ ($B$ is the branching factor, i.e. number of children of the parent node) and is stored as a vertical sparse array of some sparse horizontal vectors $\mathbf{v}^{(j,i)}$,
$$
\mathbf{K}^{(i)} = \left[\begin{array}{ccccccc} \mathbf{0} & ... & (\mathbf{v}^{(r_1, i)})^T & ... & (\mathbf{v}^{(r_{s_i}, i)})^T & ... & \mathbf{0} \end{array}\right]^T \,.
$$
We identify each chunk $\mathbf{K}^{(i)}$ with a parent node in layer $l- 1$ of the model tree, and the columns of the chunk $\mathbf{K}^{(i)}$ with the set of siblings in layer $l$ of the model tree that share the aforementioned parent node in layer $l - 1$. 

![](/assets/blog/sparse-xmr/chunkmultiplication.png)

To see why this data structure can accelerate the masked matrix multiplication, consider that one can think of the mask matrix $\mathbf{M}$ as being composed of blocks,
$$
\mathbf{M} = \left[\begin{array}{cccc} \mathbf{M}^{(1, 1)} & \mathbf{M}^{(1, 2)} & ... & \mathbf{M}^{(1, L_{l - 1})} \\ \vdots & \vdots & \ddots & \vdots \\ \mathbf{M}^{(L_{l}, 1)} & \mathbf{M}^{(L_{l}, 2)} & ... & \mathbf{M}^{(L_{l}, L_{l - 1})} \end{array}\right] \,,
$$
where the block column partition is the same as that in the definition of the column chunked weight matrix $\mathbf{W}^{(l)}$, and every block has one row and corresponds to a single query. Furthermore, every block $\mathbf{M}^{(j, i)}$ must either be composed entirely of zeros or entirely of ones.

Therefore, since $\mathbf{A}$ and $\mathbf{M}$ share the same sparsity pattern, the ranker activation matrix $\mathbf{A}$ is also composed of the same block partition as $\mathbf{M}$,
$$
\begin{split}
\mathbf{A} &= \left[\begin{array}{cccc} \mathbf{A}^{(1, 1)} & \mathbf{A}^{(1, 2)} & ... & \mathbf{A}^{(1, L_{l - 1})} \\ \vdots & \vdots & \ddots & \vdots \\ \mathbf{A}^{(L_{l}, 1)} & \mathbf{A}^{(L_{l}, 2)} & ... & \mathbf{A}^{(L_{l}, L_{l - 1})} \end{array}\right] \,, \\
\mathbf{A}^{(j, i)} &= \mathbf{M}^{(j, i)} \odot (\mathbf{x}_j \mathbf{W}^{(i)}) \,.
\end{split}
$$
Hence, for all mask blocks $\mathbf{M}^{(j, i)}$ that are $1$, we have
$$
\mathbf{A}^{(j, i)} = \mathbf{x}_j \mathbf{W}^{(i)} = \sum_{k \in S(\mathbf{x}_j) \cap S(\mathbf{W}^{(i)})} x_{jk} \mathbf{v}^{(k, i)} \,,
$$
where $S(\mathbf{x}_j)$ and $S(\mathbf{W}^{(i)})$ denote the indices of the nonzero entries of $\mathbf{x}_j$ and the nonzero rows of $\mathbf{W}^{(i)}$ respectively. The above equation says that for all entries of $\mathbf{A}$ in the same block, the intersection $k \in S(\mathbf{x}_j) \cap S(\mathbf{W}^{(i)})$ only needs to be iterated through *once per chunk*, as opposed to *once per column* as is done in a vanilla implementation. Moreover, the actual memory locations of the values actively participating in the product are physically closer in memory than they are when $\mathbf{W}^{(i)}$ is stored in CSC format. This helps contribute to better memory locality.

We remark that it remains to specify how to efficiently iterate over the nonzero entries $x_{jk}$ and nonzero rows $\mathbf{K}^{(k, i)}$ for $k \in S(\mathbf{x}_j) \cap S(\mathbf{W}^{(i)})$. This is essential for computing the vector-chunk product $\mathbf{x}_j \mathbf{W}^{(i)}$ efficiently. There are number of ways to do this, each with potential benefits and drawbacks:

1. **Marching Pointers**: The easiest method is to use a marching pointer scheme to iterate over $x_{jk}$ and $\mathbf{K}^{(k,i)}$ for $k \in S(\mathbf{x}_j) \cap S(\mathbf{K}^{(i)})$. 
2. **Binary Search**:  Since $\mathbf{x}$ can be highly sparse, the second possibility is to do marching pointers, but instead of incrementing pointers one-by-one to find all intersections, we use binary search to quickly find the next intersection.
3. **Hash-Map**: The third possibility is to enable fast random access to the rows of $\mathbf{K}^{(i)}$ via a hash-map. The hash-map maps indices $i$ to nonzero rows of $\mathbf{K}^{(i)}$. 
4. **Dense Lookup**: The last possibility is to accelerate the above hash-map access by copying the contents of the hash-map into a dense array of length $d$. Then, a random access to a row of $\mathbf{K}^{(i)}$ is done by an array lookup. This consumes the most memory.

There is one final optimization that we have found particularly helpful in reducing inference time --- and that is evaluating the nonzero blocks $\mathbf{A}^{(j, i)}$ in order of column chunk $i$. Doing this ensures that a single chunk $\mathbf{K}^{(i)}$ ideally only has to enter the cache once for all the nonzero blocks $\mathbf{A}^{(j, i)}$ whose values depend on $\mathbf{K}^{(i)}$.

## Performance Benchmarks

There are more thorough performance benchmarks in the paper. But for this blog post, I will simply show a side by side comparison of our Hash MSCM implementation against a Hash CSC implementation of an existing XMR library, NapkinXC. Since NapkinXC models can be run in PECOS (our library), we have an apples-to-apples performance comparison. We measure performance on several different data sets:

![](/assets/blog/sparse-xmr/performance.png)

Note that thanks to MSCM, our implementation is around 10x faster than NapkinXC. See the full text for more exhaustive performance analysis. 