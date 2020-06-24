<template>
<div class="min-h-screen md:flex md:flex-col">
    <Header v-on:logout="logout" class="z-20 bg-white" />

    <div class="bg-gray-100 min-h-screen md:flex md:flex-1 md:min-h-0">
        <router-view class="flex-1 max-h-screen overflow-auto relative z-10" />
    </div>

</div>
</template>

<script lang="ts" src="./Navbar.ts" />
