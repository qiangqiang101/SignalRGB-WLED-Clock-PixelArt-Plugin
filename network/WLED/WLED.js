export function Name() { return "WLED"; }
export function Version() { return "0.15.0"; }
export function Type() { return "network"; }
export function Publisher() { return "FeuerSturm"; }
export function Documentation() { return "gettingstarted/srgbmods-net-info"; }
export function Size() { return [1, 1]; }
export function DefaultPosition(){return [0, 0]; }
export function DefaultScale(){return 1.0; }
export function SubdeviceController(){ return true; }
export function DefaultComponentBrand() { return "CompGen"; }
/* global
controller:readonly
discovery: readonly
turnOffOnShutdown:readonly
LightingMode:readonly
forcedColor:readonly
*/
export function ControllableParameters() {
	return [
		{"property":"LightingMode", "group":"settings", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"settings", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"#009bde"},
		{"property":"turnOffOnShutdown", "group":"settings", "label":"Turn WLED device OFF on Shutdown", "type":"boolean", "default":"false"},
		{"property":"display_mode","label":"Display Mode", "type":"combobox", "values":["Components", "Time", "Custom Text", "Pixel Art"], "default":"Components"},
		{"property":"fontSize","label":"Font Size", "type":"combobox", "values":["Small", "Medium"], "default":"Medium"},
        {"property":"mediumColor","label":"Medium Color", "step":"5", "type":"number", "min":"5", "max":"100", "default":"50"},
		{"property":"custom_text", "label":"Display Mode: Custom Text", "type":"textfield", "default":"WLED"},
		{"property":"time_format", "label":"Display Mode: Time", "type":"textfield", "default":"hh:mm tt"},
		{"property":"pixel_art", "label":"Display Mode: Pixel Art", "type":"textfield", "default":"[ [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] ]"},
		{"property":"paddingX", "label":"Padding X", "type":"textfield", "default":0, "filter":/^\d+$/},
		{"property":"paddingY", "label":"Padding Y", "type":"textfield", "default":1, "filter":/^\d+$/},
	];
}

let WLED;
let display;
let displaySize = {width: 0, height: 0};
const MaxLedsInPacket = 485;
const BIG_ENDIAN = 1;
const WLEDicon = "iVBORw0KGgoAAAANSUhEUgAAA+gAAAH0CAYAAACuKActAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAVqklEQVR4nO3aT4ich3nH8WdmZ3d2pV1J65VkOVKbSAZHdsBtDXVME0gI6cFFFMkQu5eATS9DDzlbxYcpFKTmmNOQCqKeGiehVkqTFtqUGJziCKoGJ0girS1Hji1hrf6s1tp/M7vbQ0OJYznva+3MvI+0n8/5x/s+y8hKvquJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODuVav6AAAo7YWzD0XEU4W7xljEzgcHfw+V+Pi2iJnxUtNXzzxd++FgrwGA/mlUfQAAfASPRMSxqo/grnE8In5Y9REAUFa96gMAAAAAgQ4AAAApCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACTQqPoAAIgXzj4UEY8U7hrjn47GaOFsciziix97qw+HVWu+Nxo/eHdPqe3hCn7eS0sT8eNrOwt3k41efHH3pb69d9dExNRY8e5mb+yh+Nb64RKPfOfM07XTGz4MADZIoAOQwVMRcaxwNTIasWNf4Wzf1M146Yl/7MNZ1To/vy0e/tc/LbV96YmXB3zNB51653fiyKufK9ztm1io5L6Tv/zUU2fm7n+qxPRURBwZ9D0AUMRX3AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACTQqPoAAO5hL5zdExE7Cncjo7uiVit+Xr0e0Vsp3q2W2PzK+evjhZsHtnZj+9hq4e7qUiOuLBb/T+vU2Grs3dotcd16uZ+3pEsLozG3PFK4mxnvxa6JXvED19dSfx69tYil4lnUIrY99q31gyXOWznzdO2NEjsAuCMCHYBBOhYRzxauxrdFTO0uftryfMTs68W71aXiza88/PefKtx84wtvxrMHrxbu/vbszjj66t7C3eH9N+KlJ0v8HL1uuZ+3pL98dW+cPD9TuHv+sctx7Im3ix+4civ15zG7FHG2eBY7mvGFA9vjXInzzkfEwyV2AHBHfMUdAAAAEhDoAAAAkIBABwAAgAQEOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEmhUfQAAcHsHp5di/S/+s+ozPtTh/TdS3wcAdxv/gg4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACQg0AEAACCBRtUHAMBmc+bKlnju3z8x9Pe+cmmy1O57v9gelxdGB3wNAPCbBDoADNnF98bi5PmZqs/4UD+9OhE/vTpR9RkAsOn4ijsAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEGlUfAAD9dnWpEcfP7Onb877/i+1xeWG0cPfyld0RW2f69t5N6dbVwknpz2Nuqh8XAcDQCHQA7jlXFhtx9NW9fXvet1+fjm+/Pl083DoTMbW7b+/dlEoEevnPY1uERgfgLuIr7gAAAJCAQAcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABJoVH0AAJRWb0Q0p6q+4sM1mlVfcPfr5+fr8wDgLiPQAbh7jE5ETO+r+goGyecLwCbmK+4AAACQgEAHAACABAQ6AAAAJCDQAQAAIAGBDgAAAAkIdAAAAEhAoAMAAEACAh0AAAASaFR9AACQy/TYWuxsrhfuarVa1EeG/7v+S7ci5laG/loAGDiBDgC8z5cPLMULj94q3DWbzdi2bdsQLnq/534QcfL80F8LAAPnK+4AAACQgEAHAACABAQ6AAAAJCDQAQAAIAGBDgAAAAkIdAAAAEhAoAMAAEACAh0AAAASEOgAAACQQKPqAwCAu9Py8nJcuXJl6O9dWpqKiPGhvxcABs2/oAMAAEACAh0AAAASEOgAAACQgEAHAACABAQ6AAAAJCDQAQAAIAGBDgAAAAkIdAAAAEigUfUBAMDGfe3x+cLN+Ph4jI6OFu4u3BiLr5zO+zv8H88W/wwAcDcS6ABwD/izTywVbqamRmN8vDhuj59pxDff9H8RAGDY8v56HAAAADYRgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACQg0AEAACABgQ4AAAAJNKo+AAA2m/vH1+KxmW7hrlarxdjoWKlnNpvNws3IyEipZwEA1RDoADBkj8104+8+c7NwNzIyEvfdd1/Jp27b2FEAQOV8xR0AAAASEOgAAACQgEAHAACABAQ6AAAAJCDQAQAAIAGBDgAAAAkIdAAAAEhAoAMAAEACjaoPAAA2bnV1tW/PWl+rhd/hA8DwCXQAuAdcu3atb89aWNwSEVv79jwAoBy/HgcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEGlUfAABs3O5v7ar6BABgg/wLOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQaVR8AANze2tpazM/Pl1xPDfQWAGDwBDoAJLW+vh5LS0sl1wIdAO52vuIOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkINABAAAggUbVBwBAv02PrcWXDyyV2m7ZsmXA13xQbb0RXzs//PcCALkJdADuOTub6/HCo7dKbXftGn4on7owEke+v3Xo7wUAcvMVdwAAAEhAoAMAAEACAh0AAAASEOgAAACQgEAHAACABAQ6AAAAJCDQAQAAIAGBDgAAAAk0qj4AoArtdvuhiHikxPSddrt9etD3UJ3l5eWhv7PXrUfE6NDfC1Xy9y5AMYEObFZPRcSxErtTEXFkwLdQoZs3bw79nQsLzRDobEL+3gUo4CvuAAAAkIBABwAAgAQEOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEmhUfQBARWYj4nzRaG1t7War1TpYtGs0GrFz586+HPYRXWu32+9W8eLMVtYi/nt+pOozPtSlRb8fp//a7fZkROyr+o7foh4l/t6NiHcGfQhAVgId2JTa7faJiDhRtGu1Wocj4tzgL7pjxyPiaNVHZPOLWyPxmX++r+ozYNi+GBEvVX3Eb3G83W4/XPURAJn5FT4AAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkUKv6AIDNptVqrRdttm/fHhMTE/187al2u32knw8s5YWz34iIZwt3W2cipnYP/By4nR3NiAPbS03Pn3m69vCAz/mAdrv9fEQc69fzer1ezM7Oltp2Oh3/XxFgiPwLOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQaVR8AsAk9VzRYWlr685WVlc8W7ZrNZoyPj/fnqrvAA71L8eml04W7sbGx2L9/f6ln/s3bBzd61kf28frV+OPR80N/7+TUZDSbzcLdq/Mz8fLNXUO46IMOv/fdws0De/bEtu3bC3dV/hxV6Ha7sbCwULhbX1+/HBFHB38RAB+VQAcYsk6nc7Jo02q1PhcRhYFer9c3VaBvX5uL31/6SeFuS31L/OGOiVLPrCLQZ+q34rOj/zP8926dicnJycLdtd5YZWFb5vP9ZPOTsWfHnsJdlT9HFdbW1mJxcbHM9EaZv4cAGD5fcQcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJBAo+oDALit70XE5aJRo9F4IiI+X+J5D7Xb7edL7Gbb7faJErtK9HqrcevWrRK7Xly8eHEIF/2G7mLEykLxrH4t5pbnhnDQ+42Ojsbq6mrhbnlpaQjX3F6Zz/ett96K69evF+6urI9HxIE+XDUY7Xb7TyLi0RLTz5V5Xr1e/3lE/EOJ6ZUyzwNg+AQ6QEKdTuc7EfGdot2vovvzJR75SEQcK7E7HxGJA70X8/PzhbvFxcW4cOFCuYfu3OBRv25lIWL+3cJZtzYb10eKA7PfRkZGotvtFu4WV6oL9DKfb5lNRMSlXQ9E3L/RiwbqSxHxbL8eNjo6erbT6Rzt1/MAGD5fcQcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJBAo+oDALhzy8vLpXb1ej1GR0cHfM2d277ybkzfvFS4e2D5YjSbzcLdamMizo8d7MdpDNmb236vcLOndym2r84V7u6vzcXBlfOFu5GRqYjYW+a8SvR6vVhdXa36DACGQKAD3MWuX79eajc+Ph47duwY8DV37sDN/4pP3/qPwl2z2Yzp6enC3ezIzvjmtmf6cRpD9i+/2yrcHH7vu/GJpZ8U7qbjzXjs5puFu8vrB+P0TN4/L8vLyzE/P1/1GQAMga+4AwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASKBR9QEAbMhsRJwvsZuMiH0ldmPtdvtgmRe32+0y770cJe4bq63d12g0dhft6vV69Hq9wpeur6+sRMQbJe6rRGO9N9nr9cp8Hn3V7Xaj2+0W7hpry9ci4t3BX3Rn6r2lj/V6vW2Fu3o96vXif4uor3ffi4hflnh16T9TJf872lHmWbVarezn8U6Z5wGQl0AHuIt1Op0TEXGiaNdutw9HxEslHnkgIs6VfH2tcPHXjxyNiKNFsyfb7edjcuexot3y8nLMzs6WOG32jfir2sMlhpX4bKt1eLbc59FX3W43JiYmCnefjLe/Hu0/KvzcqrK71frGbMSzRbutW7fG1NRU8fPee/3fzjxdO9KP235N2f+OCm3ZsuXrX/3qV9N+HgD0j6+4AwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAK1qg8AYPBardbhiHipaNdoNGLnzp1DuOj9bt26FfPz82WmpzqdzpFB33OnDh069HxEHCvaTUxMxMzMzBAuujNbt26NqampMtNT7XY77efRarVKfR7NZjOmp6eHcNH7zc3NxeLiYpnp8U6nc3TQ9wBQPf+CDgAAAAkIdAAAAEhAoAMAAEACAh0AAAASEOgAAACQgEAHAACABAQ6AAAAJCDQAQAAIIFG1QcAMBRnIuK5otH6+vqeubm5Y0O4533W1ta+HxHfLjG9OOhb7laPP/544eaNN96I2dnZIVyTxj9FxOWi0dra2h/Mzc19ZQj3vM/q6uqJiPhRielrg74FgBwEOsAm0Ol0LkbEyaJdq9U6uLi4OPRAj4jXOp3OyQree8/Yv39/4ebKlSubKtA7nc7PIuJnRbtWq3Wj2+0OPdAj4kf+3APw63zFHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAKNqg8AIJVrEXG8gve+XME70xsbG4sHH3yw1PbcuXOFmxs3bmz0pHvVz6OaP/evVfBOABIT6AD8v06n825EHK36Dv7P+Ph4PProo6W2L7744oCvuXd1Op2z4c89AAn4ijsAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEGlUfAADcXrfbjbfffrvUdu/evYWb69evx8LCwkbPAgAGRKADQFKLi4vxyiuvlNo+88wzhZvTp0/HhQsXNnoWADAgvuIOAAAACQh0AAAASECgAwAAQAICHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkINABAAAggUbVBwAAt1ev12NycrLU9ubNm4Wbbre70ZMAgAES6ACQ1OTkZDz55JOlti+++OKArwEABs1X3AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACQg0AEAACCBWtUHAMBmc+jQocMR8VLRrtFoxJ49e4Zw0Qcc73Q6R6t4MQBsZv4FHQAAABIQ6AAAAJCAQAcAAIAEBDoAAAAkINABAAAgAYEOAAAACQh0AAAASECgAwAAQAKNqg8AgE3oTEQ8VzRaX1/fc/369WNlHjg9PV1mdiIiflRi91qZhwEA/VWr+gAA4PYOHTp0MCLOldnu27evzOy5TqdzciM3AQCD4yvuAAAAkIBABwAAgAQEOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQEOgAAACQg0AEAACABgQ4AAAAJCHQAAABIQKADAABAAgIdAAAAEhDoAAAAkIBABwAAgAQaVR8AAHyo9yLiVB+fd7GPzwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADI5H8BdsEUvG1eigQAAAAASUVORK5CYII=";
const colorBlack = "#000000";
let lastForcedUpdate = 0;
let jobRunning = false;
let rowOffset = 0
let colOffset = 0

const SMALL_LETTERS = {
	'A':[
		[0, 1, 0],
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'a':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	'B':[
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'b':[
		[1, 0, 0],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'C':[
		[0, 1, 1],
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'c':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 1],
		[1, 0, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'D':[
		[1, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'd':[
		[0, 0, 1],
		[0, 0, 1],
		[0, 1, 1],
		[1, 0, 1],
		[0, 1, 1],
		[0, 0, 0]
	],
	'E':[
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'e':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'F':[
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'f':[
		[0, 0, 1],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	'G':[
		[0, 1, 1],
		[1, 0, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 1],
		[0, 0, 0]
	],
	'g':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 1],
		[0, 0, 1],
		[1, 1, 1]
	],
	'H':[
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'h':[
		[1, 0, 0],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'I':[
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'i':[
		[1],
		[0],
		[1],
		[1],
		[1],
		[0]
	],
	'J':[
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'j':[
		[0, 1],
		[0, 0],
		[0, 1],
		[0, 1],
		[0, 1],
		[1, 1]
	],
	'K':[
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'k':[
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[0, 0, 0]
	],
	'L':[
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'l':[
		[1],
		[1],
		[1],
		[1],
		[1],
		[0]
	],
	'M':[
		[1, 0, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'm':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[1, 1, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'N':[
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'n':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'O':[
		[0, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'o':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'P':[
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'p':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0]
	],
	'Q':[
		[0, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 1, 1],
		[0, 0, 0]
	],
	'q':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 1],
		[1, 0, 1],
		[0, 1, 1],
		[0, 0, 1]
	],
	'R':[
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'r':[
		[0, 0],
		[0, 0],
		[1, 1],
		[1, 0],
		[1, 0],
		[0, 0]
	],
	'S':[
		[0, 1, 1],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	's':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 1],
		[0, 1, 0],
		[1, 1, 0],
		[0, 0, 0]
	],
	'T':[
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	't':[
		[0, 0, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'U':[
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	'u':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	'V':[
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'v':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'W':[
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'w':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 1],
		[1, 1, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	'X':[
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'x':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 1],
		[0, 1, 0],
		[1, 0, 1],
		[0, 0, 0]
	],
	'Y':[
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	'y':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[1, 0, 0]
	],
	'Z':[
		[1, 1, 1],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'z':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'`':[
		[1, 1],
		[0, 1],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	],
	'~':[
		[0, 1, 0, 1],
		[1, 0, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],
	'!':[
		[1],
		[1],
		[1],
		[0],
		[1],
		[0]
	],
	'@':[
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'#':[
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'$':[
		[0, 1, 0],
		[0, 1, 1],
		[1, 1, 0],
		[0, 1, ],
		[1, 1, 0],
		[0, 1, 0]
	],
	'%':[
		[1, 0, 0],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, 1],
		[0, 0, 0]
	],
	'^':[
		[0, 1, 0],
		[1, 0, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'&':[
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	'*':[
		[1, 0, 1],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[1, 0, 1],
		[0, 0, 0]
	],
	'(':[
		[0, 1],
		[1, 0],
		[1, 0],
		[1, 0],
		[0, 1],
		[0, 0]
	],
	')':[
		[1, 0],
		[0, 1],
		[0, 1],
		[0, 1],
		[1, 0],
		[0, 0]
	],
	'-':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'_':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1]
	],
	'=':[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[0, 0, 0]
	],
	'+':[
		[0, 0, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'[':[
		[1, 1],
		[1, 0],
		[1, 0],
		[1, 0],
		[1, 1],
		[0, 0]
	],
	'{':[
		[0, 1, 1],
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	']':[
		[1, 1],
		[0, 1],
		[0, 1],
		[0, 1],
		[1, 1],
		[0, 0]
	],
	'}':[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0],
		[1, 1, 0],
		[0, 0, 0]
	],
	'\\':[
		[1, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 0]
	],
	'|':[
		[1],
		[1],
		[1],
		[1],
		[1],
		[0]
	],
	';':[
		[0, 0],
		[0, 0],
		[0, 1],
		[0, 0],
		[1, 1],
		[1, 0]
	],
	':':[
		[0],
		[0],
		[1],
		[0],
		[1],
		[0]
	],
	"'":[
		[1, 1],
		[1, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	],
	'"':[
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	',':[
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[1, 1],
		[1, 0]
	],
	'<':[
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 0]
	],
	'.':[
		[0],
		[0],
		[0],
		[0],
		[1],
		[0]
	],
	'>':[
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'/':[
		[0, 0, 1],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'?':[
		[1, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[0, 0, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	'1':[
		[0, 1],
		[1, 1],
		[0, 1],
		[0, 1],
		[0, 1],
		[0, 0]
	],
	'2':[
		[1, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'3':[
		[1, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'4':[
		[0, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 0]
	],
	'5':[
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'6':[
		[0, 1, 0],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'7':[
		[1, 1, 1],
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	'8':[
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'9':[
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 1],
		[0, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'0':[
		[0, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	' ':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	]
}

const LETTERS = {
	'A':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'a':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 0],
		[0, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'B':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'b':[
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'C':[
		[0, 0, 0, 0],
		[0, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[0, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'c':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 1],
		[1, 0, 0],
		[1, 0, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	'D':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'd':[
		[0, 0, 0, 0],
		[0, 0, 0, 1],
		[0, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'E':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'e':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[0, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'F':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[0, 0, 0, 0]
	],
	'f':[
		[0, 0, 0, 0],
		[0, 0, 1, 1],
		[0, 1, 0, 0],
		[1, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
	],
	'G':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'g':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 1, 1, 0]
	],
	'H':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'h':[
		[0, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'I':[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'i':[
		[0, 1, 0],
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'J':[
		[0, 0, 0, 0],
		[0, 0, 0, 1],
		[0, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'j':[
		[0, 0, 1],
		[0, 0, 0],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 1],
		[1, 1, 0]
	],
	'K':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 1, 0],
		[1, 1, 0, 0],
		[1, 0, 1, 0],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'k':[
		[0, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 0, 1, 0],
		[1, 1, 0, 0],
		[1, 0, 1, 0],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'L':[
		[0, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'l':[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'M':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'm':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'N':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 1, 0, 1],
		[1, 0, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'n':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'O':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'o':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'P':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[0, 0, 0, 0]
	],
	'p':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[1, 0, 0, 0]
	],
	'Q':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 1]
	],
	'q':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 1]
	],
	'R':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0],
	],
	'r':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'S':[
		[0, 0, 0, 0],
		[0, 1, 1, 1],
		[1, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	's':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 1],
		[1, 1, 0, 0],
		[0, 0, 1, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'T':[
		[0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	],
	't':[
		[0, 0, 0, 0],
		[0, 1, 0, 0],
		[1, 1, 1, 1],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 1],
		[0, 0, 0, 0]
	],
	'U':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'u':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'V':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'v':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'W':[
		[0, 0, 0, 0, 0],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0],
		[0, 1, 0, 1, 0],
		[0, 0, 0, 0, 0]
	],
	'w':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'X':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 1, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'x':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'Y':[
		[0, 0, 0],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	'y':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 1, 1, 0]
	],
	'Z':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 1, 0],
		[0, 1, 0, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'z':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 1, 0],
		[0, 1, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'`':[
		[0, 0],
		[1, 0],
		[0, 1],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	],
	'~':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 0, 1],
		[1, 0, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],
	'!':[
		[0],
		[1],
		[1],
		[1],
		[0],
		[1],
		[0]
	],
	'@':[
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 1, 0],
		[1, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0]
	],
	'#':[
		[0, 0, 0, 0, 0],
		[0, 1, 0, 1, 0],
		[1, 1, 1, 1, 1],
		[0, 1, 0, 1, 0],
		[1, 1, 1, 1, 1],
		[0, 1, 0, 1, 0],
		[0, 0, 0, 0, 0]
	],
	'$':[
		[0, 0, 0],
		[0, 1, 0],
		[0, 1, 1],
		[1, 0, 0],
		[0, 1, 1],
		[1, 1, 0],
		[0, 1, 0]
	],
	'%':[
		[0, 1, 0, 0, 0],
		[1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[0, 0, 0, 1, 0]
	],
	'^':[
		[0, 0, 0],
		[0, 1, 0],
		[1, 0, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'&':[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 1, 0, 0, 0],
		[0, 1, 1, 0, 1],
		[1, 0, 0, 1, 0],
		[0, 1, 1, 0, 1],
		[0, 0, 0, 0, 0]
	],
	'*':[
		[0, 0, 0],
		[1, 0, 1],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[1, 0, 1],
		[0, 0, 0]
	],
	'(':[
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 0],
		[1, 0],
		[0, 1],
		[0, 0]
	],
	')':[
		[0, 0],
		[1, 0],
		[0, 1],
		[0, 1],
		[0, 1],
		[1, 0],
		[0, 0]
	],
	'-':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'_':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1]
	],
	'=':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[0, 0, 0]
	],
	'+':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'[':[
		[0, 0],
		[1, 1],
		[1, 0],
		[1, 0],
		[1, 0],
		[1, 1],
		[0, 0]
	],
	'{':[
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 0]
	],
	']':[
		[0, 0],
		[1, 1],
		[0, 1],
		[0, 1],
		[0, 1],
		[1, 1],
		[0, 0]
	],
	'}':[
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'\\':[
		[0, 0, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 0]
	],
	'|':[
		[1],
		[1],
		[1],
		[1],
		[1],
		[1],
		[0]
	],
	';':[
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 1],
		[0, 0],
		[0, 1],
		[1, 0]
	],
	':':[
		[0],
		[0],
		[0],
		[1],
		[0],
		[1],
		[0]
	],
	"'":[
		[1],
		[1],
		[0],
		[0],
		[0],
		[0],
		[0]
	],
	'"':[
		[0, 0, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	',':[
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 1],
		[1, 0]
	],
	'<':[
		[0, 0, 0],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 0]
	],
	'.':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[1],
		[0]
	],
	'>':[
		[0, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'/':[
		[0, 0, 0],
		[0, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'?':[
		[0, 0, 0],
		[1, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[0, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'0':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'1':[
		[0, 0],
		[0, 1],
		[1, 1],
		[0, 1],
		[0, 1],
		[0, 1],
		[0, 0]
	],
	'2':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 0, 1, 0],
		[0, 1, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'3':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[0, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'4':[
		[0, 0, 0, 0],
		[0, 0, 0, 1],
		[0, 0, 1, 1],
		[0, 1, 0, 1],
		[1, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'5':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[0, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'6':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'7':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 0, 1, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
	],
	'8':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'9':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	' ':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	]
}

const SMALL_DIGITS = 
{
	'1':[
		[0, 0, 1],
		[0, 1, 1],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 0]
	],
	'2':[
		[1, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	'3':[
		[1, 1, 0],
		[0, 0, 1],
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'4':[
		[0, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 1],
		[0, 0, 1],
		[0, 0, 0]
	],
	'5':[
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	'6':[
		[0, 1, 0],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'7':[
		[1, 1, 1],
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 0]
	],
	'8':[
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'9':[
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 1],
		[0, 0, 1],
		[0, 1, 0],
		[0, 0, 0]
	],
	'0':[
		[0, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	':':[
		[0],
		[0],
		[1],
		[0],
		[1],
		[0]
	],
	';':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	],
	'a':[
		[0, 1, 0],
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	'p':[
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'm':[
		[1, 0, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[0, 0, 0]
	],
	' ':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	],
	'/':[
		[0, 0, 1],
		[0, 0, 1],
		[0, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'-':[
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'_':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1]
	],
	'.':[
		[0],
		[0],
		[0],
		[0],
		[1],
		[0]
	],
	',':[
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[1, 1],
		[1, 0]
	],
};

const DIGITS = 
{
	'0':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'1':[
		[0, 0, 0, 0],
		[0, 0, 0, 1],
		[0, 0, 1, 1],
		[0 ,0 ,0, 1],
		[0 ,0 ,0, 1],
		[0 ,0 ,0, 1],
		[0 ,0 ,0, 0]
	],
	'2':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 0, 1, 0],
		[0, 1, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
	],
	'3':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[0, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'4':[
		[0, 0, 0, 0],
		[0, 0, 0, 1],
		[0, 0, 1, 1],
		[0, 1, 0, 1],
		[1, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'5':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[0, 0, 0, 1],
		[1, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'6':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'7':[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 0, 1, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
	],
	'8':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	'9':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 1],
		[0, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	':':[
		[0],
		[0],
		[0],
		[1],
		[0],
		[1],
		[0]
	],
	';':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	],
	'a':[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	'p':[
		[0, 0, 0, 0],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[0, 0, 0, 0]
	],
	'm':[
		[0, 0, 0, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[0, 0, 0, 0]
	],
	' ':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	],
	'/':[
		[0, 0, 0],
		[0, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[1, 0, 0],
		[1, 0, 0],
		[0, 0, 0]
	],
	'-':[
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	'_':[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1]
	],
	'.':[
		[0],
		[0],
		[0],
		[0],
		[0],
		[1],
		[0]
	],
	',':[
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 1],
		[1, 0]
	],
};

var PIXELART = [];

var COMPONENT_MAPPING = [];

export function onpixel_artChanged()
{
	if (display_mode == 'Pixel Art')
	{
		try
		{			
			PIXELART = JSON.parse(pixel_art)
			device.log('Pixel Art Updated!');
		}
		catch(ex)
		{
			device.log(ex.message);
		}
	}
}

export function ondisplay_modeChanged()
{
	switch (display_mode)
	{
		case 'Pixel Art':
			try
			{			
				PIXELART = JSON.parse(pixel_art)
				device.log('Pixel Art Updated!');
			}
			catch(ex)
			{
				device.log(ex.message);
			}
			break;
		default:
			break;
	}
}

function insertDigitIntoDisplay(display, digit, startCol) 
{
    let newLineCh = digit.length
    let digitWidth = digit[0].length
    let nLine = Math.floor((startCol + digitWidth) / displaySize.width)
    
    rowOffset = nLine * newLineCh
    if (startCol + digitWidth + 1 >= nextMultiple(startCol, displaySize.width)) {
        startCol = nextMultiple(startCol, displaySize.width) * nLine
        //device.log(startCol)
    }
    
    for (let row = 0; row < digit.length; row++) 
    {
        for (let col = 0; col < digit[row].length; col++) 
        {
			let index = (rowOffset * displaySize.width + row * displaySize.width + (displaySize.width * paddingY)) + startCol + col + parseInt(paddingX);

			if (index < displaySize.height * displaySize.width) 
			{  
				display[index] = digit[row][col];
			}
        }
    }
    //rowOffset = 0
}

function nextMultiple(value, multiple) {
    if (multiple === 0) return value; // Avoid division by zero
    //device.log(Math.ceil(value / multiple) * multiple)
    return Math.ceil(value / multiple) * multiple;
}


function insertPixelArtIntoDisplay(display, art)
{
	for (let row = 0; row < art.length; row++)
	{
		for (let col = 0; col < art[row].length; col++)
		{
			let index = (row * displaySize.width + (displaySize.width * (paddingY - 1))) + displaySize.width + col + parseInt(paddingX);

			if (index < displaySize.height * displaySize.width) 
			{  
				display[index] = art[row][col];
			}
		}
	}
}


function adjustBrightness(hex, factor) {
  hex = hex.replace(/^#/, '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

  const toHex = (c) => {
    const hexValue = c.toString(16);
    return hexValue.length === 1 ? "0" + hexValue : hexValue;
  };

  const newHex = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  return newHex;
}


function rearrangeDisplayForSnakeLayout(display) 
{
    const snakeDisplay = new Array(display.length);
    
    for (let i = 0; i < display.length; i++) 
    {
		if (COMPONENT_MAPPING.length == 0) { if (!jobRunning) { detect2DMapping(); } } else { snakeDisplay[COMPONENT_MAPPING[i]] = display[i]; }
    }

    return snakeDisplay;
}

function detect2DMapping()
{
	let instance = WLED;
	jobRunning = true;

	device.log(`Requesting 2D Mapping from http://${instance.ip}:${instance.port}/json/state/`);
	XmlHttp.Get(`http://${instance.ip}:${instance.port}/json/state/`, (xhr) => {
		if (xhr.readyState === 4) {
			if(xhr.status === 200) {
				let devicedata;

				try {
					devicedata = JSON.parse(xhr.response);

					if (devicedata.seg[0].hasOwnProperty("stopY")) 
					{
						displaySize.width = devicedata.seg[0].stop;
						displaySize.height = devicedata.seg[0].stopY;
						let length = displaySize.width * displaySize.height;
						for (let i = 0; i <= length; i++)
						{
							COMPONENT_MAPPING.push(i);
						}
						device.log('2D mapping found, automatic mapping completed.');
						jobRunning = false;
						display = new Array(displaySize.height * displaySize.width).fill(0); 
					}
					else
					{
						device.log(`2D mapping not found, unable to auto mapping. Create your 2D mapping in http://${instance.ip}:${instance.port}/settings/2D`);
					}
				} catch (e) {
					device.log("ERROR for IP " + instance.ip + ", JSON info could not be parsed!" + e);

					return;
				}
			} else {
				device.log("ERROR for IP " + instance.ip + ", device is OFFLINE or does not respond!");
			}
		}
	});
}

function replaceEx(str, obj)
{
	for (const x in obj) { str = str.replace(new RegExp(x, 'g'), obj[x]); }
	return str
}

function formatDateTime(format)
{
	const now = new Date();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const year = now.getFullYear();

	const hour12 = now.getHours() % 12 || 12;
	const hour24 = now.getHours();
	const minute = now.getMinutes();
	const second = now.getSeconds();
	const ampm = now.getHours() >= 12 ? 'pm' : 'am';

	let _format = replaceEx(format, {
		'dd': String(day).padStart(2, '0'), 'd': day, 
		'hh': String(hour12).padStart(2, '0'), 'h': hour12, 
		'HH': String(hour24).padStart(2, '0'), 'H': hour24, 
		'mm': String(minute).padStart(2, '0'), 'm': minute, 
		'MM': String(month).padStart(2, '0'), 'M': month, 
		'ss': String(second).padStart(2, '0'), 's': second, 
		'tt': ampm, 't': ampm == 'am' ? 'a' : 'p', 
		'yyyy': year, 'yyy': year, 'yy': year.toString().substring(2), 'y': year.toString().substring(2), 
	});
	return _format;
}

function displayClock() 
{
	display.fill(0);
	const now = new Date();

	let timeDigits;
	switch(display_mode) 
	{
		case 'Pixel Art':
			timeDigits = 'Pixel Art';
			break;
		case 'Custom Text':
			timeDigits = custom_text;
			break;
		default:
			if (now.getSeconds() % 2 !== 0) 
			{
				timeDigits = replaceEx(formatDateTime(time_format), {':': ';'});
			} 
			else 
			{
				timeDigits = formatDateTime(time_format);
			}
	}

	let colOffset = 0;
	for (const digit of timeDigits) 
	{
		switch(display_mode)
		{
			case 'Time':
				if (fontSize == 'Medium')
				{
					insertDigitIntoDisplay(display, DIGITS[digit], colOffset);
					if(digit == ":" || digit == ";" || digit == '.')
					{
						colOffset += 2;
					}
					else if(digit == " ")
					{
						colOffset += 1; 
					}
					else
					{
						colOffset += 5; 
					}
				}
				else
				{
					insertDigitIntoDisplay(display, SMALL_DIGITS[digit], colOffset);
					if(digit == ":" || digit == ";" || digit == '.')
					{
						colOffset += 2;
					}
					else if(digit == " ")
					{
						colOffset += 1; 
					}
					else
					{
						colOffset += 4; 
					}
				}
				
				break;
			case 'Pixel Art':
				insertPixelArtIntoDisplay(display, PIXELART);
				break;
			default:
				if (fontSize == 'Medium')
				{
					insertDigitIntoDisplay(display, LETTERS[digit], colOffset);
					switch(digit)
					{
						case ' ':
							colOffset += 1;
							break;
						case '!':
						case '|':
						case ':':
						case "'":
						case '.':
							colOffset += 2;
							break;
						case '`':
						case '(':
						case ')':
						case '[':
						case ']':
						case ';':
						case ',':
						case '1':
							colOffset += 3;
							break;
						case 'a':
						case 'c':
						case 'I':
						case 'i':
						case 'j':
						case 'L':
						case 'l':
						case 'r':
						case 'Y':
						case '$':
						case '^':
						case '*':
						case '-':
						case '=':
						case '+':
						case '{':
						case '}':
						case '\\':
						case '"':
						case '<':
						case '>':
						case '/':
						case '?':
							colOffset += 4;
							break;
						case 'T':
						case 'W':
						case '@':
						case '#':
						case '%':
						case '&':
							colOffset += 6;
							break;
						default:
							colOffset += 5;
					}
				}
				else
				{
					insertDigitIntoDisplay(display, SMALL_LETTERS[digit], colOffset);
					switch(digit)
					{
						case ' ':
							colOffset += 1;
							break;
						case 'i':
						case 'l':
						case '!':
						case '|':
						case ':':
						case '.':
							colOffset += 2;
							break;
						case 'j':
						case 'r':
						case '1':
						case '`':
						case '(':
						case ')':
						case '[':
						case ']':
						case ';':
						case "'":
						case ',':
							colOffset += 3;
							break;
						case '~':
							colOffset += 5;
							break;
						default:
							colOffset += 4;
					}
				}
		}
	}
}


function adjustBrightness(hex, factor) {
  hex = hex.replace(/^#/, '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

  const toHex = (c) => {
    const hexValue = c.toString(16);
    return hexValue.length === 1 ? "0" + hexValue : hexValue;
  };

  const newHex = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  return newHex;
}

function multiplyArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error("Arrays must have the same length");
  }

  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] * arr2[i]);
  }
  return result;
}

class WLEDDevice {
	constructor(controller) {
		this.mac = controller.mac;
		this.hostname = controller.hostname;
		this.name = controller.name;
		this.ip = controller.ip;
		this.port = controller.port;
		this.streamingPort = controller.streamingPort;
		this.deviceledcount = controller.deviceledcount;
		this.defaultOn = controller.defaultOn;
		this.defaultBri = controller.defaultBri;
	}

	changeDeviceState(forceOff = false, forceOn = false, fullBright = false) {
		DeviceState.Change(this.ip, this.defaultOn, this.defaultBri, forceOff, forceOn, fullBright, false);
	}

	SetupChannel() {
		device.SetLedLimit(this.deviceledcount);
		device.addChannel(this.name, this.deviceledcount);
	}
    
    

	SendColorPackets(shutdown = false) {
		const componentChannel = device.channel(this.name);
		let ChannelLedCount = componentChannel.ledCount > this.deviceledcount ? this.deviceledcount : componentChannel.ledCount;

		let RGBData = [];

		if(shutdown) {
			RGBData = device.createColorArray(colorBlack, ChannelLedCount, "Inline");
		} else if(LightingMode === "Forced") {
            
			RGBData = device.createColorArray(forcedColor, ChannelLedCount, "Inline");
		} else if(componentChannel.shouldPulseColors()) {
			ChannelLedCount = this.deviceledcount;

			const pulseColor = device.getChannelPulseColor(this.name);
			RGBData = device.createColorArray(pulseColor, ChannelLedCount, "Inline");
		} else {
			RGBData = componentChannel.getColors("Inline");
		}

		const NumPackets = Math.ceil(ChannelLedCount / MaxLedsInPacket);
        //const NumPackets = ChannelLedCount / MaxLedsInPacket;

		if (display_mode != 'Components') 
		{
			if (display != undefined) 
			{
				displayClock();	
				let Snake_display = rearrangeDisplayForSnakeLayout(display);
                let scaleFactor = 1.0
				for(let led_index = 0; led_index < Snake_display.length;led_index++)
				{
					if(Snake_display[led_index] == 0)
					{
						RGBData[led_index * 3] = 0;
						RGBData[led_index * 3 + 1] = 0;
						RGBData[led_index * 3 + 2] = 0;
                        
                    } else {
                        scaleFactor=1
                        if(Snake_display[led_index] == 0.5){
                            scaleFactor=mediumColor/100
                        }
                        RGBData[led_index * 3] = Math.floor(RGBData[led_index * 3] * scaleFactor);
						RGBData[led_index * 3 + 1] = Math.floor(RGBData[led_index * 3 + 1] * scaleFactor);
						RGBData[led_index * 3 + 2] = Math.floor(RGBData[led_index * 3 + 2] * scaleFactor);
                        //if(Snake_display[led_index] == 0.5){
                        //    device.log([RGBData[led_index * 3], RGBData[led_index * 3 + 1], RGBData[led_index * 3 + 2]])
                        //}
                        
                    }
				}	
			}
		}

		for(let CurrPacket = 0; CurrPacket < NumPackets; CurrPacket++) {
			const startIdx = CurrPacket * MaxLedsInPacket;
			const highByte = ((startIdx >> 8) & 0xFF);
			const lowByte = (startIdx & 0xFF);
			let packet = [0x04, 0x02, highByte, lowByte];
			packet = packet.concat(RGBData.splice(0, MaxLedsInPacket*3));
			udp.send(this.ip, this.streamingPort, packet, BIG_ENDIAN);
            //device.log(packet)
		}
	}
}

export function Initialize() {
	device.setName(controller.name);
	device.setImageFromBase64(WLEDicon);
	device.addFeature("udp");
	WLED = new WLEDDevice(controller);
	WLED.SetupChannel();
	WLED.changeDeviceState(false, true, true);

	detect2DMapping();

	if (display_mode == 'Pixel Art')
	{
		try
		{			
			PIXELART = JSON.parse(pixel_art)
			device.log('Pixel Art Updated!');
		}
		catch(ex)
		{
			device.log(ex.message);
		}
	}
	
}

export function Render() {
	WLED.SendColorPackets();
}

export function Shutdown(suspend) {
	WLED.SendColorPackets(true);
	WLED.changeDeviceState(turnOffOnShutdown);
}

export function ImageUrl() {
	return "https://raw.githubusercontent.com/SRGBmods/public/main/images/wled/998_led_nodemcu.png";
}

// -------------------------------------------<( Discovery Service )>--------------------------------------------------


export function DiscoveryService() {
	this.IconUrl = "https://raw.githubusercontent.com/SRGBmods/public/main/images/wled/998_led_nodemcu.png";

	this.MDns = [ "_wled._tcp.local." ];

	this.forceDiscover = function(ipaddress) {
		if(!ipaddress || ipaddress === undefined) {

		} else if (this.isValidIP(ipaddress)) {
			service.log("Forcing Discovery for WLED device at IP: " + ipaddress);
			this.ip = ipaddress;
			this.port = 80;
			this.forced = true;
			this.offline = false;
			this.prepareDiscovery(false);

		} else {

		}
	};

	this.forceDelete = function(ipaddress) {
		if(!ipaddress || ipaddress === undefined) {

		} else if (this.isValidIP(ipaddress)) {
			let devicelist_string = service.getSetting("forcedDiscovery", "devicelist");

			if(devicelist_string === undefined || devicelist_string.length === 0) {

			} else if(devicelist_string !== undefined && devicelist_string.length > 0 && devicelist_string.includes(ipaddress)) {
				service.log("Force Deleting WLED device at IP: " + ipaddress);

				const devicelist = JSON.parse(devicelist_string);
				const macAddress = devicelist[ipaddress];
				delete devicelist[ipaddress];
				devicelist_string = JSON.stringify(devicelist);
				service.saveSetting("forcedDiscovery", "devicelist", devicelist_string);
				this.ip = ipaddress;
				this.mac = macAddress;
				this.port = 80;
				this.forced = true;
				this.prepareDiscovery(true);

			}
		} else {

		}
	};

	this.isValidIP = function(ipaddress) {
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
			return true;
		}

		return false;
	};

	this.prepareDiscovery = function(deletion = false) {
		const instance = this;

		if(!deletion) {
			service.log(`Requesting basic Device Information for forced discovery...`);
			service.log(`http://${instance.ip}:${instance.port}/json/info/`);
			XmlHttp.Get(`http://${instance.ip}:${instance.port}/json/info/`, (xhr) => {

				if (xhr.readyState === 4) {
					if(xhr.status === 200) {
						let devicedata;

						try {
							devicedata = JSON.parse(xhr.response);
						} catch (e) {
							service.log("ERROR for IP " + instance.ip + ", JSON info could not be parsed!");

							return;
						}

						if(devicedata.hasOwnProperty("brand") && devicedata.brand === "WLED") {
							const wledname = devicedata.name === "WLED" ? "wled-" + devicedata.mac.substr(devicedata.mac.length - 6) : devicedata.name;
							const forcedvalue = {"hostname":devicedata.ip, "mac":devicedata.mac, "name":wledname, "port":80, "forced":true};
							instance.Discovered(forcedvalue);
						} else {
							service.log("ERROR for IP " + instance.ip + ", device is NOT a WLED flashed MCU!");
						}
					} else {
						service.log("ERROR for IP " + instance.ip + ", device is OFFLINE or does not respond!");
					}
				}
			});
		} else {
			for(const controller of service.controllers) {
				if(controller.id === instance.mac) {
					service.removeSetting(controller.id, "name");
					service.removeSetting(controller.id, "ip");
					service.removeController(controller);

					return;
				}
			}
		}
	};

	this.Initialize = function() {
		service.log("Initializing Plugin!");
		service.log("Searching for WLED devices...");
	};

	this.loadForcedDevices = function() {
		const devicelist_string = service.getSetting("forcedDiscovery", "devicelist");

		if(devicelist_string !== undefined && devicelist_string.length > 0) {
			service.log("Refreshing force discovered devices...");

			const devicelist = JSON.parse(devicelist_string);
			Object.keys(devicelist).forEach(key => {
				let controllerExists = false;

				for(const cont of service.controllers) {
					if(cont.obj.ip === key) {
						controllerExists = true;
					}
				}

				if(!controllerExists) {
					this.forceDiscover(key);
				}
			});
		}
	};

	this.Update = function() {
		for(const cont of service.controllers) {
			cont.obj.update();
		}
		const currentTime = Date.now();

		if(currentTime - lastForcedUpdate >= 60000) {
			lastForcedUpdate = currentTime;
			this.loadForcedDevices();
		}
	};

	this.Discovered = function(value) {
		service.log("Device discovered:");
		service.log(value);

		const controller = service.getController(value.mac);

		if (controller === undefined) {
			service.addController(new WLEDBridge(value));
		} else {
			if(this.forced === value.forced) {
				controller.updateWithValue(value);
			}
		}
	};
}

class WLEDBridge {
	constructor(value) {
		this.readyToAnnounce = false;
		this.announced = false;
		this.hostname = value.hostname;
		this.mac = value.mac;
		this.name = value.name;
		this.id = value.mac;
		this.port = value.port;
		this.arch = "";
		this.deviceledcount = 0;
		this.firmwareversion = 0;
		this.linked = service.getSetting(this.mac, "ip");
		this.ip = "";
		this.connected = false;
		this.forced = value.forced;
		this.defaultOn = false;
		this.defaultBri = 128;
		this.signalstrength = 0;
		this.lastUpdate = Date.now();
		this.firstUpdate = true;
		this.offline = false;

		service.log("Constructed: "+this.name);

		if(!this.forced) {
			this.getDeviceIP();
		} else {
			this.ip = this.hostname;
			this.getDeviceInfo();
		}
	}

	updateWithValue(value) {
		this.forced = value.forced;
		this.hostname = value.hostname;
		this.mac = value.mac;
		this.name = value.name;
		this.port = value.port;
		this.id = value.mac;
		this.ip = this.forced ? value.hostname : value.ip;

		if(this.forced) {
			this.saveForceDiscovery();
		}

		service.log("Updated: "+this.mac);
		service.updateController(this);
		this.getDeviceInfo();
	}

	update() {
		if (this.waitingforlink){
			this.waitingforlink = false;
			this.connected = this.linked === this.ip;
			this.readyToAnnounce = true;
			service.updateController(this);
		}

		this.createDevice();

		const currentTime = Date.now();

		if(currentTime - this.lastUpdate >= (Math.floor(Math.random() * 10000) + 50000)) {
			this.lastUpdate = currentTime;
			this.getDeviceInfo();
		}
	}

	createDevice() {
		if(this.readyToAnnounce && !this.announced) {
			if(!this.connected) {
				this.saveController();
				service.log("Adding Controller: " + this.name + " - IP: " + this.ip + " - UDP Port: " + this.streamingPort);
			} else {
				service.updateController(this);
				service.announceController(this);
				service.log("Announcing existing Controller: " + this.name + " - IP: " + this.ip + " - UDP Port: " + this.streamingPort);
			}

			this.announced = true;

			if(this.connected) {
				DeviceState.Change(this.ip, this.defaultOn, this.defaultBri, false, true, true);
			}

			service.updateController(this);
		}
	}

	saveController() {
		service.saveSetting(this.mac, "name", this.name);
		service.saveSetting(this.mac, "ip", this.ip);
		service.updateController(this);
		service.announceController(this);
		this.connected = true;
	}

	getDeviceInfo() {
		const instance = this;
		service.log(`Requesting complete Device Information...`);
		service.log(`http://${instance.ip}:${instance.port}/json/`);
		XmlHttp.Get(`http://${instance.ip}:${instance.port}/json/`, (xhr) => {

			if (xhr.readyState === 4) {
				if(xhr.status === 200) {
					instance.offline = false;
					service.updateController(instance);
					instance.setDeviceInfo(JSON.parse(xhr.response));
				} else {
					instance.offline = true;
					service.updateController(instance);
					service.log("ERROR for IP " + instance.ip + ", device is OFFLINE or does not respond!");
				}
			}
		});
	}

	getDeviceIP() {
		const instance = this;
		service.log(`Reading IPV4 from JSON API...`);

		const mdnsHostname = instance.hostname.substring(0, instance.hostname.length - 1);
		service.log(`http://${mdnsHostname}:${this.port}/json/`);
		XmlHttp.Get(`http://${mdnsHostname}:${this.port}/json/`, (xhr) => {

			if (xhr.readyState === 4) {
				if(xhr.status === 200) {
					const devicedata = JSON.parse(xhr.response);
					instance.ip = devicedata.info.ip;
					service.log("IP for " + instance.hostname + " received: " + instance.ip);
					instance.offline = false;
					service.updateController(instance);
					instance.setDeviceInfo(devicedata);
				} else {
					instance.offline = true;
					service.updateController(instance);
					service.log("ERROR for mdnsHostname: " + instance.hostname + ", device is OFFLINE or does not respond!");
				}
			}
		});
	}

	setDeviceInfo(response) {
		if(this.firstUpdate) {
			this.defaultOn = response.state.on;
			this.defaultBri = response.state.bri;
			this.firstUpdate = false;
		}

		this.streamingPort = response.info.udpport;
		this.arch = response.info.arch;
		this.firmwareversion = response.info.ver;
		this.deviceledcount = response.info.leds.count;
		this.signalstrength = response.info.wifi.signal;
		service.log("Device info for " + this.name + " with IP " + this.ip + " received:");
		service.log("UDP Port: " + this.streamingPort + " - Arch: " + this.arch + " - Firmware: " + this.firmwareversion + " - LED count: " + this.deviceledcount + " - default State: " + (this.defaultOn ? "ON" : "OFF") + " - default Brightness: " + this.defaultBri + " - Signal strength: " + this.signalstrength);

		this.linked = service.getSetting(this.mac, "ip");

		if(this.linked === this.ip) {
			this.connected = true;
			this.readyToAnnounce = true;
		}

		if(this.forced) {
			this.saveForceDiscovery();
		}

		service.updateController(this);
	}

	saveForceDiscovery() {
		let devicelist_string = service.getSetting("forcedDiscovery", "devicelist");
		let devicelist = {};

		if(devicelist_string === undefined || devicelist_string.length === 0) {
			devicelist[this.ip] = this.mac;
			devicelist_string = JSON.stringify(devicelist);
			service.saveSetting("forcedDiscovery", "devicelist", devicelist_string);
		} else if(devicelist_string !== undefined && devicelist_string.length > 0 && !devicelist_string.includes(this.ip)) {
			devicelist = JSON.parse(devicelist_string);
			devicelist[this.ip] = this.mac;
			devicelist_string = JSON.stringify(devicelist);
			service.saveSetting("forcedDiscovery", "devicelist", devicelist_string);
		}
	}

	startLink() {
		DeviceState.Change(this.ip, this.defaultOn, this.defaultBri, false, true, true);
		this.waitingforlink = true;
		service.updateController(this);
	}

	startRemove() {
		DeviceState.Change(this.ip, this.defaultOn, this.defaultBri);
		service.removeSetting(this.mac, "name");
		service.removeSetting(this.mac, "ip");
		this.connected = false;
		this.announced = false;
		this.readyToAnnounce = false;
		service.suppressController(this);
		service.updateController(this);
	}

	startDelete() {
		discovery.forceDelete(this.ip);
	}

	startForceDiscover() {
		discovery.forceDiscover(this.ip);
	}

	turnOn() {
		DeviceState.Change(this.ip, this.defaultOn, this.defaultBri, false, true, true);
	}

	turnOff() {
		DeviceState.Change(this.ip, this.defaultOn, this.defaultBri, true);
	}
}

class XmlHttp {
	static Get(url, callback, async = true) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, async);

		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = callback.bind(null, xhr);

		xhr.send();
	}

	static Post(url, callback, data, async = true) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url, async);

		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = callback.bind(null, xhr);

		xhr.send(JSON.stringify(data));
	}
}

class DeviceState {
	static Change(ip, defaultOn, defaultBri, forceOff = false, forceOn = false, fullBright = false, async = true) {
		const JSONurl = "http://" + ip + ":80/json/state/";
		XmlHttp.Post(JSONurl, (xhr) => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				// request successful, do some shit later on here!
			}
		},
		{on: (forceOff ? false : forceOn ? true : defaultOn), bri: (fullBright ? 255 : defaultBri), live: false},
		async);
	}
}
