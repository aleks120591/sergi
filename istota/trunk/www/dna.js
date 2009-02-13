function Dna(rawData)
{
	this.genes = new Array();
	
	var blockSize = 5;
	var l = parseInt(rawData.length / blockSize);
	
	if (rawData.length % blockSize) l++;
	
	if (typeof(rawData) == "string")
		function getAsByte(idx){
			var t = rawData.charCodeAt(idx);
			if (idx%2) t = ~t;
		return t%256;
		}
	else
		function getAsByte(idx){return rawData[idx];}
	
	function getItem(base, shift)
	{
		var p = base*blockSize+shift;
		return (p<rawData.length) ? getAsByte(p) : 0;
	}
	
	for(var i=0;i<l;i++)
	{
		var g = new Gene(getItem(i, 0), getItem(i, 1), getItem(i, 2), getItem(i, 3), getItem(i, 4));
		this.genes.push(g);
	}
}