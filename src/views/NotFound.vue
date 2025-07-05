<template>
    <section class="not-found">
        <div class="container">
            <h1 class="code">404</h1>
            <p class="message">Oops! The page you're looking for doesn't exist.</p>
            <router-link to="/" class="home-link">Back to Home</router-link>
        </div>
    </section>
</template>

<style scoped lang="scss">
.not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    color: #444;
    .container {
        max-width: 600px;
        padding: 2rem;
    }
    .code {
        font-size: 6rem;
        font-weight: 900;
        margin-bottom: 1rem;
    }

    .message {
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }
    .home-link {
        display: inline-block;
        padding: 0.6rem 1.2rem;
        background: #444;
        color: white;
        border-radius: 4px;
        text-decoration: none;
        &:hover {
            box-shadow: 2px 2px 2px #e1e1e1;
        }
    }
}
</style>
