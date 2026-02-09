(function () {
    'use strict';

    const GOL_CONFIG = {
        CELL_SIZE: 18,
        UPDATE_INTERVAL: 480,
        CELL_COLOR: 'rgba(107, 114, 128, 0.17)',
        CELL_BORDER_RADIUS: 3,
        CELL_GAP: 1,
        INITIAL_DENSITY: 0.13,
        FADE_IN_DURATION: 800,
        CANVAS_OPACITY: 0.65,
    };

    let canvas, ctx, hostElement;
    let cols, rows;
    let grid, nextGrid;
    let lastUpdate = 0;
    let animationId;
    let canvasOpacity = 0;
    let fadeStartTime = null;

    function getHost() {
        return document.querySelector('.hero') || document.querySelector('.page-container');
    }

    function createCanvas() {
        hostElement = getHost();
        if (!hostElement) return false;

        canvas = document.createElement('canvas');
        canvas.id = 'gol-canvas';
        canvas.style.cssText = [
            'position: absolute',
            'top: 0',
            'left: 0',
            'width: 100%',
            'height: 100%',
            'z-index: 0',
            'pointer-events: none',
            'opacity: 0',
            'transition: opacity 0.3s ease',
        ].join(';');

        hostElement.insertBefore(canvas, hostElement.firstChild);
        ctx = canvas.getContext('2d');
        return true;
    }

    function getHostDimensions() {
        var w = hostElement.scrollWidth;
        var h = hostElement.scrollHeight;
        // For the hero (single viewport section), bounding rect is fine
        // For page-container, scrollHeight captures the full content length
        if (h <= 0) {
            var rect = hostElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
        }
        return { width: w, height: h };
    }

    function resizeCanvas() {
        if (!canvas || !hostElement) return;

        var dims = getHostDimensions();
        var dpr = window.devicePixelRatio || 1;

        canvas.width = dims.width * dpr;
        canvas.height = dims.height * dpr;
        canvas.style.width = dims.width + 'px';
        canvas.style.height = dims.height + 'px';
        ctx.scale(dpr, dpr);

        var oldCols = cols;
        var oldRows = rows;
        var oldGrid = grid;

        cols = Math.ceil(dims.width / GOL_CONFIG.CELL_SIZE);
        rows = Math.ceil(dims.height / GOL_CONFIG.CELL_SIZE);

        grid = new Uint8Array(cols * rows);
        nextGrid = new Uint8Array(cols * rows);

        if (oldGrid && oldCols && oldRows) {
            for (var y = 0; y < Math.min(rows, oldRows); y++) {
                for (var x = 0; x < Math.min(cols, oldCols); x++) {
                    grid[y * cols + x] = oldGrid[y * oldCols + x];
                }
            }
            // Fill new rows with random cells so expanded area isn't blank
            for (var ny = oldRows; ny < rows; ny++) {
                for (var nx = 0; nx < cols; nx++) {
                    grid[ny * cols + nx] = Math.random() < GOL_CONFIG.INITIAL_DENSITY ? 1 : 0;
                }
            }
            for (var ey = 0; ey < rows; ey++) {
                for (var ex = oldCols; ex < cols; ex++) {
                    grid[ey * cols + ex] = Math.random() < GOL_CONFIG.INITIAL_DENSITY ? 1 : 0;
                }
            }
        }
    }

    function initializeGrid() {
        for (let i = 0; i < grid.length; i++) {
            grid[i] = Math.random() < GOL_CONFIG.INITIAL_DENSITY ? 1 : 0;
        }
    }

    function countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = (x + dx + cols) % cols;
                const ny = (y + dy + rows) % rows;
                count += grid[ny * cols + nx];
            }
        }
        return count;
    }

    function updateGrid() {
        let changed = false;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const idx = y * cols + x;
                const neighbors = countNeighbors(x, y);
                const alive = grid[idx];

                if (alive) {
                    nextGrid[idx] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    nextGrid[idx] = (neighbors === 3) ? 1 : 0;
                }
                if (nextGrid[idx] !== grid[idx]) changed = true;
            }
        }

        const temp = grid;
        grid = nextGrid;
        nextGrid = temp;

        if (!changed) {
            for (let i = 0; i < Math.ceil(cols * rows * 0.02); i++) {
                const rx = Math.floor(Math.random() * cols);
                const ry = Math.floor(Math.random() * rows);
                grid[ry * cols + rx] = 1;
            }
        }
    }

    function draw() {
        if (!ctx || !canvas || !hostElement) return;

        var dims = getHostDimensions();

        ctx.clearRect(0, 0, dims.width, dims.height);
        ctx.fillStyle = GOL_CONFIG.CELL_COLOR;

        const size = GOL_CONFIG.CELL_SIZE - GOL_CONFIG.CELL_GAP * 2;
        const r = GOL_CONFIG.CELL_BORDER_RADIUS;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y * cols + x]) {
                    const px = x * GOL_CONFIG.CELL_SIZE + GOL_CONFIG.CELL_GAP;
                    const py = y * GOL_CONFIG.CELL_SIZE + GOL_CONFIG.CELL_GAP;

                    ctx.beginPath();
                    ctx.moveTo(px + r, py);
                    ctx.lineTo(px + size - r, py);
                    ctx.quadraticCurveTo(px + size, py, px + size, py + r);
                    ctx.lineTo(px + size, py + size - r);
                    ctx.quadraticCurveTo(px + size, py + size, px + size - r, py + size);
                    ctx.lineTo(px + r, py + size);
                    ctx.quadraticCurveTo(px, py + size, px, py + size - r);
                    ctx.lineTo(px, py + r);
                    ctx.quadraticCurveTo(px, py, px + r, py);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }

    function animate(timestamp) {
        if (fadeStartTime === null) {
            fadeStartTime = timestamp;
        }
        const elapsed = timestamp - fadeStartTime;
        if (elapsed < GOL_CONFIG.FADE_IN_DURATION) {
            canvasOpacity = (elapsed / GOL_CONFIG.FADE_IN_DURATION) * GOL_CONFIG.CANVAS_OPACITY;
        } else {
            canvasOpacity = GOL_CONFIG.CANVAS_OPACITY;
        }
        canvas.style.opacity = canvasOpacity;

        if (timestamp - lastUpdate >= GOL_CONFIG.UPDATE_INTERVAL) {
            updateGrid();
            lastUpdate = timestamp;
        }

        draw();
        animationId = requestAnimationFrame(animate);
    }

    function handleVisibility() {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            } else {
                if (!animationId) {
                    lastUpdate = 0;
                    animationId = requestAnimationFrame(animate);
                }
            }
        });
    }

    function init() {
        if (window.innerWidth <= 768) return;

        if (!createCanvas()) return;
        resizeCanvas();
        initializeGrid();
        handleVisibility();

        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                if (window.innerWidth <= 768) {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                    if (canvas && canvas.parentNode) {
                        canvas.parentNode.removeChild(canvas);
                    }
                    return;
                }
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                resizeCanvas();
                draw();
            }, 200);
        });

        // Watch for content changes that expand the page (dynamic loaders)
        if (typeof ResizeObserver !== 'undefined') {
            var lastHeight = 0;
            new ResizeObserver(function () {
                var h = hostElement.scrollHeight;
                if (h !== lastHeight) {
                    lastHeight = h;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    resizeCanvas();
                }
            }).observe(hostElement);
        }

        setTimeout(function () {
            animationId = requestAnimationFrame(animate);
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
