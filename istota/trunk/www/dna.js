function Dna(rawData)
{
	this.genes = new Array();
	
	var blockSize = 5;
	var l = parseInt(rawData.length / blockSize);
	
	if (rawData.length % blockSize) l++;
	
	if (rawData instanceof String)
		function getAsByte(idx){return rawData.charCodeAt(idx)%256;}
	else
		function getAsByte(idx){return rawData[idx];}
	
	function getItem(base, shift)
	{
		var p = base*blockSize+shift;
		return (p<rawData.length) ? getAsByte(p) : 0;
	}
	
	for(var i=0;i<l;i++)
	{
		var g = new Gene(getItem(i, 0), getItem(i, 1), getItem(i, 2), getItem(i, 3));
		this.genes.push(g);
	}
}